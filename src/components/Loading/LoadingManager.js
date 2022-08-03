class LoadingManager {
    defaultLoading = null;

    register(_ref) {
        if (!this.defaultLoading) {
            this.defaultLoading = _ref;
        }
    }

    unregister(_ref) {
        if (!!this.defaultLoading && this.defaultLoading._id === _ref._id) {
            this.defaultLoading = null;
        }
    }

    getDefault() {
        return this.defaultLoading;
    }
}

export default new LoadingManager();
