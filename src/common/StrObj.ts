class StrObj {
  strs: string[][];

  constructor(strs: string[][]) {
    this.strs = strs;
  }

  public findTwoIndex(word: string): [number, number] | undefined {
    if (!this.strs) {
      return;
    }
    const lineIndex = this.strs.findIndex((str) => str.find((v) => v.includes(word)));
    if (lineIndex > -1) {
      const wordIndex = this.strs[lineIndex].findIndex((v) => v.includes(word));
      if (lineIndex > -1 && wordIndex > -1) {
        return [lineIndex, wordIndex];
      }
    }
  }
}

export default StrObj;