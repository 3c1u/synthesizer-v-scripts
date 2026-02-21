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
    getNavigation(): CoordinateSystem
    getSelection(): TrackInnerSelectionState
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

  interface CoordinateSystem extends NestedObject {}

  /**
   * 選択状態の基底インターフェース。
   * @see https://resource.dreamtonics.com/scripting/ja/SelectionStateBase.html
   */
  interface SelectionStateBase extends NestedObject {
    /** この選択状態が対応しているすべてのオブジェクトタイプについて選択を解除します。選択に変更があった場合は true を返します。 */
    clearAll(): boolean
    /** 選択されているものがあるかどうか確認します。 */
    hasSelectedContent(): boolean
    /** 選択されたオブジェクトに未完了の編集があるかどうか確認します。 */
    hasUnfinishedEdits(): boolean
    registerClearCallback(): void
    registerSelectionCallback(): void
  }

  /**
   * NoteGroupReference の選択を管理するインターフェース。
   * @see https://resource.dreamtonics.com/scripting/ja/GroupSelection.html
   */
  interface GroupSelection extends SelectionStateBase {
    /** すべての NoteGroupReference の選択を解除します。選択範囲に変更があれば true を返します。 */
    clearGroups(): boolean
    /** 選択された NoteGroupReference の配列を選択順に取得します。 */
    getSelectedGroups(): NoteGroupReference[]
    /** NoteGroupReference が 1 つ以上選択されているか確認します。 */
    hasSelectedGroups(): boolean
    /** 選択に NoteGroupReference を追加します。 */
    selectGroup(reference: NoteGroupReference): void
    /** NoteGroupReference の選択を解除します。選択範囲に変更があれば true を返します。 */
    unselectGroup(reference: NoteGroupReference): boolean
  }

  /**
   * ピアノロールの選択状態オブジェクト。
   * `SV.getMainEditor().getSelection()` で取得します。
   * @see https://resource.dreamtonics.com/scripting/ja/TrackInnerSelectionState.html
   */
  interface TrackInnerSelectionState extends GroupSelection {
    /** すべてのノートの選択を解除します。選択が変更された場合 true を返します。 */
    clearNotes(): boolean
    /** すべてのピッチコントロールの選択を解除します。(2.1.2 からサポート) */
    clearPitchControls(): boolean
    /** 選択された Note の配列を選択順に取得します。 */
    getSelectedNotes(): Note[]
    /** 選択されたピッチコントロールオブジェクトの配列を取得します。(2.1.2 からサポート) */
    getSelectedPitchControls(): (PitchControlPoint | PitchControlCurve)[]
    /** 指定されたパラメータタイプの選択されたオートメーションポイント（Blick 位置）の配列を取得します。 */
    getSelectedPoints(parameterType: string): number[]
    /** 選択されている Note が 1 つ以上あるかどうか確認します。 */
    hasSelectedNotes(): boolean
    /** 選択されたピッチコントロールオブジェクトがあるかどうか確認します。(2.1.2 からサポート) */
    hasSelectedPitchControls(): boolean
    /** Note を選択します。 */
    selectNote(note: Note): void
    /** ピッチコントロールオブジェクトを選択します。(2.1.2 からサポート) */
    selectPitchControls(
      controls: (PitchControlPoint | PitchControlCurve)[],
    ): void
    /** 指定されたパラメータタイプのオートメーションポイントを選択します。 */
    selectPoints(parameterType: string, positions: number[]): void
    /** Note の選択を解除します。選択が変更された場合 true を返します。 */
    unselectNote(note: Note): boolean
    /** ピッチコントロールオブジェクトの選択を解除します。(2.1.2 からサポート) */
    unselectPitchControls(
      controls: (PitchControlPoint | PitchControlCurve)[],
    ): void
    /** 指定されたパラメータタイプのオートメーションポイントの選択を解除します。 */
    unselectPoints(parameterType: string, positions: number[]): void
  }
}
