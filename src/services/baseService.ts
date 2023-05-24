import axios, { AxiosResponse } from "axios";

interface requestGetProps<T> {
  withAuth?: boolean;
  params?: Record<string, unknown>;
  token?: string;
  needLogin?: boolean;
}

const ENVAPI = "http://54.254.188.38:9001";

export const requestGet = async <T>(
  url: string,
  { withAuth = true, params, token, needLogin = true }: requestGetProps<T>
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.get(`${ENVAPI}${url}`, {
      params,
      headers: {
        ...(withAuth && {
          Authorization: `Bearer ${token}`,
        }),
      },
    });

    //@ts-ignore
    if (response.statusCode === 401 || token === "") {
    }
    return response.data;
  } catch (error: any) {
    if (error.response.status === 401) {
    }
    throw error;
  }
};

interface requestPostProps<T> {
  withAuth?: boolean;
  data?: T;
  token?: string;
  needLogin?: boolean;
}

export const requestPost = async <T>(
  url: string,
  {
    withAuth = true,
    data: requestBody,
    token,
    needLogin = true,
  }: requestPostProps<T>
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.post(
      `${ENVAPI}${url}`,
      requestBody,
      {
        headers: {
          ...(withAuth && {
            Authorization: `Bearer ${token}`,
          }),
        },
      }
    );
    console.log("###", { response, token });
    //@ts-ignore
    if (response.statusCode === 401 || token === "") {
    }
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const requestLogout = async (message?: string) => {};

// export const requestGet = async (url, { withAuth = true, params, needLogin = true, getErrorMessage }) => {
//     try {
//       const token = window.localStorage.getItem('authToken')
//       const { data } = await axios.get(url, {
//         params,
//         headers: {
//           ...(withAuth && {
//             Authorization: `Bearer ${token}`
//           })
//         }
//       })
//       return data
//     } catch (e) {
//       const err = {
//         status: e?.response?.status,
//         statusText: e?.response?.data?.message
//       }
//       return err
//     }
//   }

// export const requestPost = async (url, { withAuth = true, data: requestBody, needLogin = true, getErrorMessage }) => {
//     try {
//       const token = window.localStorage.getItem('authToken')
//       const { data } = await axios.post(url, requestBody, {
//         headers: {
//           ...(withAuth && {
//             Authorization: `Bearer ${token}`
//           })
//         }
//       })
//       return data
//     } catch (e) {
//       const err = {
//         status: e?.response?.status,
//         statusText: e?.response?.data?.message
//       }
//       return err
//     }
//   }
