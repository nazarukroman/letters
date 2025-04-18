export const ResponseFactory = {
  createSuccess(data) {
    return { isOk: true, data };
  },
  createFailure(error) {
    const err = error instanceof Error ? error : new Error(String(error));
    return { isOk: false, error: err };
  },
};
