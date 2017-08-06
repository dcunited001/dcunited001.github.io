class RenderPass {
    constructor(programInfo, options = {}) {
        this._programInfo = progamInfo;
    }

    get programInfo() {
        return this._programInfo;
    }

    set programInfo(programInfo) {
        this._programInfo = programInfo;
    }

    // TODO: remove uniformLocations use those attached to ProgramInfo
}
