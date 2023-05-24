import React from "react";
import Divider from "../components/CustomUI/Divider";
import Flex from "../components/CustomUI/Flex";
import Icon from "../components/CustomUI/Icon";
import Logo from "../components/Logo";
import SignInForm from "../components/SignInForm";
import { requestGet } from "../services/baseService";
import { btn_stroke_light } from "../styles/custom-components-classes";

export default function SignIn() {
  const handleGoogleOauth = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const responseData = await requestGet<any>("/v1/google/auth", {});
      console.log({ responseData });
      if (responseData?.statusCode === 200) {
        const link = document.createElement("a");
        link.style.display = "none";
        link.target = "_blank";
        link.href = responseData?.data?.url;
        document.body.appendChild(link);
        link.click();
      } else {
        alert("Google Authentication Error");
      }
    } catch (error) {
      console.error({ error });
      alert("Google Authentication Error");
    }
  };

  return (
    <div
      className='bg-white w-full py-10 center-col '
      style={{ borderRadius: "8px" }}
    >
      <div className='center-col ' style={{ width: "320px" }}>
        <Logo />

        <div className='center-col gap-4  my-10 w-full'>
          <p>Sign in to Platter</p>
          <button className={`${btn_stroke_light}`} onClick={handleGoogleOauth}>
            <img src='/images/google.svg' width={24} height={24} alt='google' />
            <p className=''>Continue with Google</p>
          </button>
          <Flex direction='row' gap='16px'>
            <Divider />
            <p>OR</p>
            <Divider />
          </Flex>

          <SignInForm />
        </div>
      </div>
    </div>
  );
}
