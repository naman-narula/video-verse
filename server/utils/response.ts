function prepareResponse(code: number, message?: string, data?: Object) {
  return {
    code,
    message,
    data
  }
}

export default prepareResponse;