import { FakeToken } from "./consts";

export default function fakeReq() {
  const authorization = `Bearer ${FakeToken}`;
  const req = {
    headers: {
      authorization
    }
  };

  return req;
}