import { serialize } from "cookie";
import React, { useState } from "react";
import { requestPost } from "../services/baseService";
import { anchorLink } from "../util/helpers";
import Button from "./CustomUI/Button";
import Field from "./CustomUI/Field";
import Flex from "./CustomUI/Flex";

type SignInFormProps = {};

export default function SignInForm({}: SignInFormProps) {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSaveToken = (value: string) => {
    const token = value;
    document.cookie = serialize("token", token);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get("username");
    const password = formData.get("password");

    const data = {
      username,
      password,
    };

    console.log({ data });
    try {
      const responseData = await requestPost<any>("/v1/auth/login", {
        data,
        token: "",
      });
      console.log({ responseData });
      if (responseData?.statusCode === 200) {
        handleSaveToken(responseData?.data?.accessToken);
        anchorLink("/main.html", false);
      } else {
        alert("Sign In Fail");
      }
    } catch (error) {
      alert("Sign In Fail");
      console.error("LOGIN ERROR", { error });
    }
  };

  // const handleButtonClick = () => {
  //   window.location.href = "nGePeT Dimana mana://";
  // };

  return (
    <form action='' onSubmit={handleLogin} style={{ width: "100%" }}>
      <Field
        name='username'
        className='mb-4'
        placeholder='Username '
        icon='email'
        value={name}
        onChange={(e: any) => setName(e.target.value)}
        required
      />
      <Field
        name='password'
        className='mb-2'
        placeholder='Password'
        icon='lock'
        type='password'
        value={password}
        onChange={(e: any) => setPassword(e.target.value)}
        required
      />
      <Flex direction='column' items='start' gap='24px'>
        <Button
          type='button'
          variant='text'
          size='0'
          onClick={() => {
            anchorLink("https://app.platter.id/sign-in", true);
          }}
        >
          Forgot password?
        </Button>

        <Button
          type='submit'
          variant='contained'
          size='lg'
          fullwidth={true}
          onClick={() => {
            console.log("Sign In Clicked");
            // handleButtonClick();
          }}
        >
          Sign in with Platter AI
        </Button>
      </Flex>

      {/* <button
    className="mt-4 btn-stroke-light btn-large w-full"
    type="button"
    onClick={() => router.push('/register')}
  >
    Don&lsquo;t have an account?
  </button> */}
    </form>
  );
}
