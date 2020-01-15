import Repository from "./repository.js";

export default {
    getResources(multiModelId, modelId) {
        return Repository.get(`/${multiModelId}/models/${modelId}/resources`);
    },
    getResource(multiModelId, modelId, resId) {
        return Repository.get(`/${multiModelId}/models/${modelId}/resources/${resId}`);
    },
    getMultiModels() {
        return Repository.get('/');
    },
    getMultimodel(multiModelId) {
        return Repository.get(`/${multiModelId}`);
    },
    getModels(multiModelId) {
        return Repository.get(`/${multiModelId}/models`);
    },
    getModel(multiModelId, modelId) {
        return Repository.get(`/${multiModelId}/models/${modelId}`);
    },
    getModelResources(multiModelId, modelId) {
        return Repository.get(`/${multiModelId}/models/${modelId}/resources`);
    },
    getSnapshots(multiModelId) {
        return Repository.get(`/${multiModelId}/snapshots`);
    },
    getSnapshot(multiModelId, snapId) {
        return Repository.get(`/${multiModelId}/snapshots/${snapId}`);
    },
    getSnapshotResources(multiModelId, snapId) {
        return Repository.get(`/${multiModelId}/snapshots/${snapId}/resources`);
    },
    getSnapshotResource(multiModelId, snapId, resourceId) {
        return Repository.get(`/${multiModelId}/snapshots/${snapId}/resources/${resourceId}`);
    },
};
