import { Request, Response } from "express";

function writeResponse(err: any, data: any, res: Response) {
  if (err) {
    res.status(err.code && Number.isInteger(err.code) ? err.code : 500);
    return res.json({
      status: "error",
      message: err.message,
    });
  }
  res.status(200);
  const response = {
    status: "Success",
    data: data,
  };
  return res.json(response);
}

function invoker(promise: any) {
  return promise
    .then((data) => {
      return [data, null];
    })
    .catch((err) => {
      return [null, err];
    });
}

export { writeResponse, invoker };
