/**
 * Pure Procedural Web Audio API sound synthesizer for authentic vintage mechanical typewriter
 * Zero external audio files required, runs offline, zero latency.
 */

class TypewriterAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.7;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Mechanical key clack - realistic dual-stage metal linkage click + typebar impact
   */
  public playKeyClick(variation: number = 0) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.85, now);
    masterGain.connect(ctx.destination);

    // 1. Initial sharp metal click (High frequency transient burst)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const baseFreq = 1200 + (Math.random() * 400 - 200) + (variation * 50);
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(180, now + 0.025);

    gain1.gain.setValueAtTime(0.8, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc1.connect(gain1);
    gain1.connect(masterGain);

    osc1.start(now);
    osc1.stop(now + 0.04);

    // 2. Heavy typebar hammer strike (bandpassed noise transient)
    const bufferSize = ctx.sampleRate * 0.05;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(2400 + Math.random() * 600, now);
    noiseFilter.Q.setValueAtTime(3.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7, now + 0.004);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    whiteNoise.start(now + 0.004);
    whiteNoise.stop(now + 0.05);

    // 3. Chassis resonance thud (Low frequency body reverberation)
    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(220 + Math.random() * 30, now + 0.006);
    thud.frequency.exponentialRampToValueAtTime(60, now + 0.04);

    thudGain.gain.setValueAtTime(0.45, now + 0.006);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    thud.connect(thudGain);
    thudGain.connect(masterGain);

    thud.start(now + 0.006);
    thud.stop(now + 0.06);
  }

  /**
   * Spacebar - heavier, wide metallic clunk
   */
  public playSpace() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.9, now);
    masterGain.connect(ctx.destination);

    // Deep wooden / cast iron bar resonance
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.06);

    oscGain.gain.setValueAtTime(0.9, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(oscGain);
    oscGain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.08);

    // Mechanical latch snap
    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    click.type = 'sawtooth';
    click.frequency.setValueAtTime(950, now);
    click.frequency.exponentialRampToValueAtTime(220, now + 0.03);

    clickGain.gain.setValueAtTime(0.4, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    click.connect(clickGain);
    clickGain.connect(masterGain);
    click.start(now);
    click.stop(now + 0.04);
  }

  /**
   * Crisp brass carriage bell - authentic "DING!"
   */
  public playBell() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.8, now);
    masterGain.connect(ctx.destination);

    // Primary bell tone (Pure high metallic brass ring)
    const bell1 = ctx.createOscillator();
    const bellGain1 = ctx.createGain();
    bell1.type = 'sine';
    bell1.frequency.setValueAtTime(2093, now); // C7

    bellGain1.gain.setValueAtTime(0.7, now);
    bellGain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    bell1.connect(bellGain1);
    bellGain1.connect(masterGain);

    // Harmonic bell overtone
    const bell2 = ctx.createOscillator();
    const bellGain2 = ctx.createGain();
    bell2.type = 'sine';
    bell2.frequency.setValueAtTime(3135.96, now); // G7

    bellGain2.gain.setValueAtTime(0.4, now);
    bellGain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    bell2.connect(bellGain2);
    bellGain2.connect(masterGain);

    // High shimmer overtone
    const bell3 = ctx.createOscillator();
    const bellGain3 = ctx.createGain();
    bell3.type = 'sine';
    bell3.frequency.setValueAtTime(4186, now); // C8

    bellGain3.gain.setValueAtTime(0.25, now);
    bellGain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    bell3.connect(bellGain3);
    bellGain3.connect(masterGain);

    // Strike impulse click
    const strike = ctx.createOscillator();
    const strikeGain = ctx.createGain();
    strike.type = 'triangle';
    strike.frequency.setValueAtTime(5000, now);
    strike.frequency.exponentialRampToValueAtTime(1000, now + 0.015);

    strikeGain.gain.setValueAtTime(0.5, now);
    strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    strike.connect(strikeGain);
    strikeGain.connect(masterGain);

    bell1.start(now);
    bell2.start(now);
    bell3.start(now);
    strike.start(now);

    bell1.stop(now + 1.3);
    bell2.stop(now + 0.9);
    bell3.stop(now + 0.6);
    strike.stop(now + 0.03);
  }

  /**
   * Carriage return lever slide + bell ring
   */
  public playCarriageReturn() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // 1. Play the bell
    this.playBell();

    // 2. Play the carriage slide ratchet zip (series of fast micro clicks)
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.6, now);
    masterGain.connect(ctx.destination);

    const clicksCount = 7;
    for (let i = 0; i < clicksCount; i++) {
      const clickTime = now + 0.05 + i * 0.035;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800 - i * 40, clickTime);
      osc.frequency.exponentialRampToValueAtTime(200, clickTime + 0.015);

      gain.gain.setValueAtTime(0.4, clickTime);
      gain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.02);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(clickTime);
      osc.stop(clickTime + 0.025);
    }
  }

  /**
   * Paper platen roller ratchet click
   */
  public playPaperRoll() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.7, now);
    masterGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.025);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.035);
  }

  /**
   * Paper tear / rip sound
   */
  public playPaperTear() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.65, now);
    masterGain.connect(ctx.destination);

    const bufferSize = ctx.sampleRate * 0.25;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.linearRampToValueAtTime(3200, now + 0.2);
    filter.Q.setValueAtTime(2.0, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.26);
  }

  /**
   * Ink stamp stamp thud (for task completion / verification)
   */
  public playStamp() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.85, now);
    masterGain.connect(ctx.destination);

    // Deep rubber stamp thud
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.09);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  /**
   * Backspace / correction escapement click
   */
  public playBackspace() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.75, now);
    masterGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.03);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.045);
  }
}

export const typewriterAudio = new TypewriterAudioEngine();
