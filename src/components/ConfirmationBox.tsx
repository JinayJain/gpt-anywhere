import { NotAllowedIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Tag,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const ConfirmationBox = ({
  prompt,
  tempPrompt,
  tempFiles,
  onGenerate = () => {},
  onCancel = () => {},
}: {
  prompt: string;
  tempPrompt: string;
  tempFiles: any;
  onGenerate?: (prompt: string, temperature: number) => void;
  onCancel?: () => void;
}) => {
  function convertString(input: string) {
    // Regular expression to match unwanted characters
    const regex = /#\(([^[]+)\[[^\]]+\]\)/g;

    // Replace unwanted characters and maintain the text inside parentheses
    const result = input.replace(regex, "$1 ").replace(/\s+/g, " ").trim();

    return result;
  }

  return (
    <Box bg="whiteAlpha.800" p={4} rounded="md">
      {/* <Text fontStyle="italic" lineHeight={10}>
        Draft MSA for
        <Tag size="lg" variant={"solid"} colorScheme="gray" mx={3}>
          <Avatar
            src="data:image/png;base64,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"
            size="xs"
            name="Segun Adebayo"
            ml={-1}
            mr={2}
          />
          <TagLabel>Datasintesa</TagLabel>
        </Tag>
        dated March 25, 2023 inside
        <Tag size="lg" colorScheme="whatsapp" mx={3}>
          <Avatar
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Google_Docs_logo_%282014-2020%29.svg/1481px-Google_Docs_logo_%282014-2020%29.svg.png"
            size="xs"
            name="docs"
            ml={-1}
            mr={2}
          />
          <TagLabel>Google Docs</TagLabel>
        </Tag>
        based on
        <Tag size="lg" colorScheme="whatsapp" mx={3}>
          <Avatar
            src="data:image/png;base64,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"
            size="xs"
            name="google drive"
            ml={-1}
            mr={2}
          />
          <TagLabel>Acme_Corp_MSA.docx</TagLabel>
        </Tag>
        and share it with
        <Tag size="lg" colorScheme="linkedin" mx={3}>
          <Avatar
            src="https://bit.ly/sage-adebayo"
            size="xs"
            name="Segun Adebayo"
            ml={-1}
            mr={2}
          />
          <TagLabel>Aldi Prasetyo</TagLabel>
        </Tag>
        and
        <Tag size="lg" colorScheme="linkedin" mx={3}>
          <Avatar
            src="https://bit.ly/sage-adebayo"
            size="xs"
            name="Segun Adebayo"
            ml={-1}
            mr={2}
          />
          <TagLabel>Bryan</TagLabel>
        </Tag>
      </Text>

      <Text
        fontStyle="italic"
        mt={10}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        Reviewing
        <Tag size="lg" colorScheme="whatsapp" mx={3}>
          <Avatar
            src="data:image/png;base64,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"
            size="xs"
            name="google drive"
            ml={-1}
            mr={2}
          />
          <TagLabel>Acme_Corp_MSA.docx</TagLabel>
        </Tag>
      </Text>
      <Text
        fontStyle="italic"
        mt={3}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        Creating document
        <Tag size="lg" colorScheme="whatsapp" mx={3}>
          <Avatar
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABm1BMVEX////u7u7/ugAArEdChfTt7e0AZtrrQzQXgDj5+fn09PT7+/vx8fH/vQAArjwAiJb1hyIAY9/qPDUwfvW80Pi2y/X/tgA6gvVRjPT49vAAfjk4i04AqDn/tAAApS0YfjgHey/w9/9hji4RkT4ApCf55bXvQClgo3cAhjei2LcMnD2hnyIAr0h9lCnnsw2Ny5/BpB5Vji00gza0pRp1ji7725j9uBy/481hwIDp9e9twYk8sl0AWt3sNiHI1fMATNfJ2s9KnWRYrXaozrwAdyIvnVLVsCL/68T7y2i/4dBIhzOJlSio17z669H+wDLX6+L8znH27+D/25T8xlhHtmj63aT+wkd+xpIdrVBVu3WQz6X8ymz54bj+zXD+vzD70YNGl6zbn3HvhzkefvuYcbLGZHaLtNvoTzzis7b45ORsjePjgIG31e7WWGLjz8F0edPtVzetZZrupaLaTVK6cpXWiJCjwd9wmt3xl5DRXGrvdkt2gtn20tHd4/P1Ow7UOUDneHDAYYKRr+3coKmccq/Pq6tFfdrlWVKLX6nY/aGOAAANx0lEQVR4nO2d+X8TxxXAdyUt7c4saY1AYl1Zrait2I0bmqbYyEa0tDTYqWUhjA8cAm2dhDNpCk0JBCcpaUv/7K6kvWd2dubt7PH5ZN+Pk/CYL2/2HXM8KYojSLXFcIecEU13hzRnCDsjujtUSFWqIk9XSVgSloQlYUlYqGmlRKjZ4tPlDPl0OeLT5UhBVSFHdFe4hhBjqFCqKDbH5FpxbK55NjecIUSulUKpEiP0rWrDGQFOKzNVJWFJWBLmr6okjNaV0MVnpkoxHNGxLbo7hBlDyBlB7lAxVXmoxUq1UlBVqHS5rC1KwpIw/2mVhIUgDLt4R9guPl1CqUFsGqoVn2AFh4fCkk48JP9xsUrg6+S/JCUD9KnCw9+dX1tbu3LlJxzy+ytra+f/MNR1qqqks0qceZPJpKVp883Fqz+byA85ZPI/Xl18c1MJq5IxK+m1hbU+V/94lYuMAH3vmizCNKsn1LvYbv3ipwDC2XcqjQ2z8ITKZqtVrR5AAN+vVCqNlWsFJ8SHbQuwWm0BjPjuSQuxMrdQaEJlacJnyaIo4uyfJoCVxgSxqIT6UtsGrL4hCvj+25WKhyiTUCPiJybjrhs//fsFtni60KZjQUsEnc3seycrjjRMmbNSdFmCcO/AR1gVAzxX8ckdU9qsdC/xSZ4fKWt+QEFEP6AVNOTNSuIuBtqcDwCKrNPZt04GEOdGsmYls7bQbwVNWF1e5Ab8ZRCw0tgpHqGGt0KAlhG5Cd+uhKQxKByhisN8lhE5EWd/dZIg3DYLRqjp5wkT8q7T2XMEoIV4oWCEaEgB5HU2xBody0oKhBpcl4bXqITLHIiUNTpxpxuJZ8VhQzcH8nQ5I6qna2zCVSqghRhLOPsOFdAy4iDprGxCOflRK4IwPu7/mrpGx0bc7qhSsjbS5oAc18u4CSP+nG3F2XcjTGgh7nYKU1v0ovgmiEzA30TxWbJnFoZwP3KNVuP8adQaHUvjeqcghJssQKY/jfCjLuJILQbhRSYhw9kEayYK4QYqAKGGVyPdjC3RmzYNNqHlbBTYrKQSBute6jqN8KfhmolixD0zOWHSeKicjzNhVH5K1Ew0I96AzcofD8VuRBBDyjAeMKKOImsmGqKOALPy39PwUJ0MkHIkxsoA6Qlp2IgUfxrjR511et3QALOSWFvEuhlbiHVKrZloiAMkPiuZhOs8JqzS4j7PGh0T7nRyJVziBCTWKd8aHcvcBSNHwh4vYLiOiqyZaFY0cyTkcjOO+AkjayYa4d1OboSbAnyBuM+omWgyMKTuYgR2l9m6YrOZEKILyKqZKEbc6GgCswoTeucOoq8elPAmd5x4zkZgjY5lbkGHv8WAZ21q70AM0PWn/H7UMeIOzmMXQ1njDPY+WZzGejG+yqTGyL62iNgh5TFiXM1EkRUze0IlfBDDhWj50/iaiWbEu9kTiroZG3Fx9pygm7ERBwbPrCQS9m5CAMf+FATopqfZEUbvkMbIWyDA6e5ploQ6FHB9tAJFNA0YISwe0s7SeGR+S9mdgxFa6SksHroicCeAOLLnldbNHjL3ANFigniNPauxyLqpoN+EmnBoZVHXoEbcY89KlVZbaDp5ZM8n7X08VvUB0Ihz1zIiNHoHyzDC6nCiCupsGis4E0INc+yQ0k24hKcfzwXgOp3eW0yd0NgEArYOsKMKGjEml1BSJ8SQhHRCuIocVQtQd3o3A0J9CxwpsKdqG+psBum/tzBugt2M4akaQI24Z6bdNUI5hLqZ84pPlf4B2Nl0WBNN3jXCENghDUrLr0ozRlAjNkxyVjK7RmDmkT3LhEtBVZ1dKOKH5Kwk1hZoFepmLhKqoOnp3CCsSiKhBk5I2z2C8DY0Pd0Jq5JHCE9IW2vk0upcT1hjpEBoYOAarbaGJKEBjhgVnBKhpoMT0kMcVDWd1l1oxLiRDqGG2DeDGBa8hahbD3gHRlhZMSMJKdGCvz8DjrsZFCXzqzq11YOyAHc2qXSN4D2yJ01IqJqIpnbAGxq31RR2MXRoNnPQo34M43R5ADXiNoJk3jGE0B1SKyGNJNTBzuZCRzoh4CBmIsvr5D+WOy3DgAGOn0ZJJxQ6svebcItBqCLw7ulGRzLhEFz3Uha8b1oIXAuPDEpLIjghvgUDrLaHbEJjBI4YSCYh5VETJ+A+ZcEHpoXA6ekuDqlKsIuRoO7FIVVEEFNNoBGdzMZTFREPHVRmfwZwQrqFw6rIVg+3oV/iDRRWBc5LoZGite5e0vEIieVj7gGN2DCMkCpw14gEBzFhVbQPBJqezu2gKEJBG0Y9aoo14b6nnUWo74CPapAcQmg20+opxHKgXlwBb7xtd6QQghPSLd5rPuANDfvuaUJC1qMmplg1BSehMboDI6xURkZyQrib4W/n2AGnp9c7sYQaEYqDNxXAWxfrhCqb0JbA9QJ0B/opDoxEXSOQrq/DAKvVIVNz6O/BAxigVWPgGN0eKjVrA2+vtdYUxoZIcPVMUq0PoUFxl1AVWCoxuxia8B1SR5Z7hip0dXkENeL4aRS8tgBdQBxLewupYoQK9KhmvHsKJkQ9aN27DnjoAnU2czqckGjmwU24aZ8DiBCCj2o24ITgHdJ9TCz4eELlbtL0VJgQHCnmewaEELyh4aSnwl0joEf2rS0nlxF8BgK+SWSnp6I2hCakrZvYUMOEXK0eoOlpo2HfPRXrGqHDD2KUkKr4rM3+K6HOxn1MK/DeQtPBbmZNZ2wXxBz6Jb17KlJbcL+dJAiHCR7Rg++erogSajr4ZtAhTtLq4Uaia4sChEYPXFP0ErXYAKend0wxwoieQfEyv6VrSQjBF92n7Re4CRHYzVQV3utVUYV5A1wLCxBq4IS0vYqSEia6e8q7i4GXwJe7dMaGiE0YHQ+n09pIcB2Ms2uEgtaBd0jbQwXegMK+XIHAh/t7I+6uEfvQr/CQUBX9MUQ2t0PQw/3GhQ5nXqqD615CFYBQNeBPozzlLEINQ4P9/JYUQhW8e+pr2MO0IfgsbZ9QBSPUENTZbI9CqqiEOvQ9xTwKq4K2CTDA6Snrdq0zLQ0Dt/HdI3sJ7Rw7wA2NuetcNoRtkS6vI0IVvNUD1NncYRJO7wEbwNJ+fgmHVKkiDSiC09KgGxo0wvBTBR124tu6qEj92U0Mu0nUGOCwKjJrgxG2V6U2P9cMWHraWFDjdzFAR76Tq+paWFWSFv0dUMRoLBhhVZII13uyCVXQRffUCOcPFemEoLunXISA79BOSJMShn6ypgMwIh9h+w1RsXdIfXfU3ckTNYxb1vjCp1tGBf6cvls5KSqVAbEcSEL8I2H58+mJnHHktCvk0Bn+odN/+bGo/PUyhw2V+qUZQak362nI0Uf9U2LS/XhI2pAMYp9cOiEotXSk2bz3AzHp30dEaPXE+W/GsShhPSXCWvOjrhjhqQeeQyNyDS9d1h/OiBE20yKsnRUzYvcR3y4GevzbYpiwVqt/KmTE/mcKF6GhNIWMmJ4Ja82/iRB2n+u8J6SXhb7EFAlrtY8FED8fGdxnwCLuNMVFai3Tv/MT9p9g/lNudIJ/naYJWGvWvuYmfGqInOM/5jbiUaqEtfo/eI3Y/QwJvbd4yIuY6lco4Gv6X2BVqGsEd9hPF9CSp3yEL0aYvn8Secr9T76gmLIJx3lNn8uE9ydzF+kaYc5wOZu0AS1EnmXa/XQ6d5G7GIgrKKYaKmzCf3MY8fOROKGKn8UjzqQPaPkajjX6pQIgNHrFIKzVn8eu0xcKhNDKwGMRswCsNb+Ki/rdlzBC1Twb52wyIazVXscAPlJghFYtHBcxsgFsxiSnXt0r3DUiLgPPBrDWPMtcplbGDe4aYfTYyzQjwtrRPRbhN0neWzCD4kzq+YwjzOR07GYSvOVG/2VYMStAS6J3M7rf4iSEmnk62tmkXDf5pf6vSMKvA2dCgPf45rNII2YHaPmaKMLuEyUhYfTuaQYpqQ8x0ohaUkINv4pAzJbwq3tUvv53SlJCy4gRyzRLQAvxNZXwhSlCSMbDyZm4Tt8gzixUTKVOraH6dkLKjIcOKqNrRI1mxYwJqbsZ3ec4tOqA7/GpYT9rQJqvOfXSCK1EaNcIysZb1oC0Gqr7xHn7k9SGChkxMil9g0Ke0vS1yM4fwj33iBoj01AxFWLTrfsf1/0nJ9Rz9zPj9DsUMF53wi4xAaFyJhAxZnIwoVVDBX1N/z4mYx6YEHUCESOHr7AWPqXpfoll/r4FQsOAEXMhDAaM/gPe37fgbOsQiBg5fIUTQt/Fhf4XvtueTPFQY3pf9ny1cD6AFqKb13S/7QUu44J3MfzfqJfZ5OJnxuImp91vHqAU+uofOwfDeQG6+zXdpw8sghR+OeDyiUv5Etq+pv/0pR7w/vJ+G6E3cTe5LVKL8KEVME496iEtJUJFeXXiUj7B0JZ6v//6Oz08K6m/b9H5ZKaeU7CwpHn0vyeqTs6Kt8bnIdSw+erZ0VG9mb1Yf+uzVxGzgtqQ2urBMM3j41cPz2YtDx8fH5uRs7JFqGuExn4kYbpCDimMIdafY6tChhE7K6m/0umMkJ1gKVs+PlUqUBV0VokJNXJaBVAlk5DyD18sVSVhSVgS5q9K6qPBQqqidY0AtHqI/R2N/FR5qIlaPQSXT5FUQX7DkmNaBVJVEpaEJWH+qr5fhBS/rInoYrv4vFSRXSOStHoopKqCployszZyVRchXS5ri5KwJMx/WiVhSfi9Ivw/KwlnN9WVPHkAAAAASUVORK5CYII="
            size="xs"
            name="google drive"
            ml={-1}
            mr={2}
          />
          <TagLabel>Acme_Corp_MSA.docx</TagLabel>
        </Tag>
      </Text>
      <Text
        fontStyle="italic"
        mt={3}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        Sharing with
        <Tag size="lg" colorScheme="linkedin" mx={3}>
          <Avatar
            src="https://bit.ly/sage-adebayo"
            size="xs"
            name="Segun Adebayo"
            ml={-1}
            mr={2}
          />
          <TagLabel>Aldi Prasetyo</TagLabel>
        </Tag>
        and
        <Tag size="lg" colorScheme="linkedin" mx={3}>
          <Avatar
            src="https://bit.ly/sage-adebayo"
            size="xs"
            name="Segun Adebayo"
            ml={-1}
            mr={2}
          />
          <TagLabel>Bryan</TagLabel>
        </Tag>
      </Text> */}
      {tempPrompt && tempFiles && tempFiles?.length !== 0 ? (
        <>
          <Text fontStyle="italic" lineHeight={10}>
            Prompt: {convertString(tempPrompt)} ?
          </Text>
          {tempFiles?.map((file: string, i: number) => {
            return (
              <Text
                key={i}
                fontStyle="italic"
                mt={3}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                Reviewing
                <Tag size="lg" colorScheme="whatsapp" mx={3}>
                  <Avatar
                    src="data:image/png;base64,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"
                    size="xs"
                    name="google drive"
                    ml={-1}
                    mr={2}
                  />
                  <TagLabel>{file}</TagLabel>
                </Tag>
              </Text>
            );
          })}
        </>
      ) : null}
      <Center
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        mt={4}
      >
        <Button
          size="sm"
          mr={3}
          // leftIcon={<NotAllowedIcon />}
          onClick={() => {
            onGenerate(tempPrompt, 1);
          }}
          colorScheme="green"
        >
          Yes
        </Button>
        <Button
          size="sm"
          // leftIcon={<NotAllowedIcon />}
          onClick={() => {
            onCancel();
          }}
          colorScheme="red"
        >
          No
        </Button>
      </Center>
    </Box>
  );
};

export default ConfirmationBox;
