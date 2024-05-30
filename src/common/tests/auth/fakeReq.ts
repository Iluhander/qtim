import { FakeAccessToken } from "./consts";

export default function fakeReq() {
  const authorization = `Bearer ${FakeAccessToken}`;
  const req = {
    headers: {
      authorization
    }
  };

  return req;
}