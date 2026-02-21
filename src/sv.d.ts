/**
 * @see https://resource.dreamtonics.com/scripting/ja/index.html
 */
declare namespace SV {
  function T(str: string): string
  function getMainEditor(): MainEditorView
  function finish(): void
  function showCustomDialog<_TForm extends CustomDialogForm>(
    form: _TForm,
  ): CustomDialogResult
  function showMessageBox(title: string, message: string): void

  const QUARTER: number

  interface CustomDialogForm {
    readonly title: string
    readonly message?: string
    readonly buttons: 'YesNoCancel' | 'OkCancel'
    readonly widgets: readonly CustomDialogWidget[]
  }

  interface CustomDialogWidgetBase {
    readonly name: string
    readonly type: string
  }

  interface CustomDialogSlider extends CustomDialogWidgetBase {
    readonly type: 'Slider'
    readonly label: string
    readonly minValue: number
    readonly maxValue: number
    readonly interval: number
    readonly default: number
  }

  interface CustomDialogComboBox extends CustomDialogWidgetBase {
    readonly type: 'ComboBox'
    readonly label: string
    readonly choices: readonly string[]
    readonly default?: number
  }

  type CustomDialogWidget = CustomDialogSlider | CustomDialogComboBox

  interface CustomDialogResult {
    readonly status: 'Yes' | 'No' | boolean
    readonly answers: Record<string, unknown>
  }

  interface NestedObject {
    isMemoryManaged(): boolean
    getParent(): NestedObject | undefined
    getIndexInParent(): number
  }

  interface ScriptableNestedObject extends NestedObject {
    clearScriptData(): void
    getScriptData(key: string): unknown
    getScriptDataKeys(): string[]
    hasScriptData(key: string): boolean
    removeScriptData(key: string): void
    setScriptData(key: string, value: unknown): void
  }

  interface MainEditorView extends NestedObject {
    getCurrentGroup(): NoteGroupReference
    getCurrentTrack(): Track
  }

  type NoteLanguage =
    | 'mandarin'
    | 'japanese'
    | 'english'
    | 'cantonese'
    | 'spanish'
    | string

  type NoteMusicalType = 'sing' | 'rap' | string

  interface NotePhonemeAttributes {
    readonly leftOffset?: number
    readonly position?: number
    readonly activity?: number
    readonly strength?: number
  }

  interface NoteAttributes {
    readonly rTone?: number
    readonly rIntonation?: number
    readonly dF0VbrMod?: number
    readonly expValueX?: number
    readonly expValueY?: number
    readonly phonemes?: NotePhonemeAttributes[]
  }

  interface Note extends ScriptableNestedObject {
    clone(): Note
    getAttributes(): NoteAttributes
    getDetune(): number
    getDuration(): number
    getEnd(): number
    getLanguageOverride(): NoteLanguage
    getLyrics(): string
    getMusicalType(): NoteMusicalType
    getOnset(): number
    getPhonemes(): string
    getPitch(): number
    getPitchAutoMode(): number
    getRapAccent(): number
    getRetakes(): RetakeList
    setAttributes(attributes: NoteAttributes): void
    setDetune(detune: number): void
    setDuration(t: number): void
    setLanguageOverride(language: NoteLanguage): void
    setLyrics(lyrics: string): void
    setMusicalType(type: NoteMusicalType): void
    setOnset(t: number): void
    setPhonemes(phonemes: string): void
    setPitch(pitch: number): void
    setPitchAutoMode(mode: number): void
    setRapAccent(accent: number): void
    setTimeRange(onset: number, duration: number): void
  }

  interface NoteGroup extends ScriptableNestedObject {
    addNote(note: Note): number
    addPitchControl(pitchControl: PitchControlPoint | PitchControlCurve): number
    clone(): NoteGroup
    getName(): string
    getNote(index: number): Note
    getNumNotes(): number
    getNumPitchControls(): number
    getParameter(typeName: string): Automation
    getPitchControl(index: number): PitchControlPoint | PitchControlCurve
    getUUID(): string
    removeNote(index: number): void
    removePitchControl(index: number): void
    setName(name: string): void
  }

  interface Automation extends ScriptableNestedObject {}

  interface PitchControlPoint extends ScriptableNestedObject {}

  interface PitchControlCurve extends ScriptableNestedObject {}

  interface RetakeList extends ScriptableNestedObject {}

  interface NoteGroupReferenceVoice {
    readonly paramLoudness?: number
    readonly paramTension?: number
    readonly paramBreathiness?: number
    readonly paramGender?: number
    readonly paramToneShift?: number
    readonly vocalModeParams?: Record<
      string,
      {
        readonly pitch?: number
        readonly timbre?: number
        readonly pronunciation?: number
      }
    >
    readonly tF0Left?: number
    readonly tF0Right?: number
    readonly dF0Left?: number
    readonly dF0Right?: number
    readonly tF0VbrStart?: number
    readonly tF0VbrLeft?: number
    readonly tF0VbrRight?: number
    readonly dF0Vbr?: number
    readonly fF0Vbr?: number
  }

  interface NoteGroupReference extends ScriptableNestedObject {
    clone(): NoteGroupReference
    getDuration(): number
    getEnd(): number
    getOnset(): number
    getPitchOffset(): number
    getTarget(): NoteGroup
    getTimeOffset(): number
    getVoice(): NoteGroupReferenceVoice
    isInstrumental(): boolean
    isMain(): boolean
    isMuted(): boolean
    setMuted(muted: boolean): void
    setPitchOffset(pitchOffset: number): void
    setTarget(group: NoteGroup): void
    setTimeOffset(blickOffset: number): void
    setTimeRange(onset: number, duration: number): void
    setVoice(attributes: NoteGroupReferenceVoice): void
  }

  interface Track extends ScriptableNestedObject {
    addGroupReference(group: NoteGroupReference): number
    clone(): Track
    getDisplayColor(): string
    getDisplayOrder(): number
    getDuration(): number
    getGroupReference(index: number): NoteGroupReference
    getMixer(): TrackMixer
    getName(): string
    getNumGroups(): number
    isBounced(): boolean
    removeGroupReference(index: number): void
    setBounced(enabled: boolean): void
    setDisplayColor(colorStr: string): void
    setName(name: string): void
  }

  interface TrackMixer extends ScriptableNestedObject {
    getGainDecibel(): number
    getPan(): number
    isMuted(): boolean
    isSolo(): boolean
    setGainDecibel(gainDecibel: number): void
    setMuted(muted: boolean): void
    setPan(pan: number): void
    setSolo(solo: boolean): void
  }
}
