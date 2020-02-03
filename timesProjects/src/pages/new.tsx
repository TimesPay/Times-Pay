import { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { Input, InputLabel } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import { fetcher, defaultOption } from '../utils/fetcher';
import BasicLayout from '../components/BasicLayout';
import globalStyle from '../styles/globalStyle';

registerPlugin(FilePondPluginImagePreview);
registerPlugin(FilePondPluginFileEncode);
registerPlugin(FilePondPluginFileValidateType);

interface Props {
}
interface TextInputProps {
  name: string,
}

const TextInputField = (props:TextInputProps) => {
  return (
    <Field
      name={props.name}
    >
    {({
      field, // { name, value, onChange, onBlur }
      form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
      meta,
    }:FieldProps) => (
      <div style={{marginLeft: "40%", marginTop: 20}}>
        <InputLabel>{props.name}</InputLabel>
        <Input type="text" placeholder={typeof field.value == "string" ? field.value : field.value.toString()} {...field} required/>
        {meta.touched && meta.error && (
          <div style={globalStyle.error}>{meta.error}</div>
        )}
      </div>
    )}
    </Field>
  )
}
const Page: NextPage<Props> = (props: Props) => {
  // const { data, error } = useSWR('/api/projects', url=>fetcher(url,{
  //   ...defaultOption
  // }));
  // console.log("data", data);
  const [projectImage, setProjectImage] = useState([]);
  const [projectWhitePaper, setProjectWhitePaper] = useState([]);
  const [projectImageDataURL, setProjectImageDataURL] = useState("");
  const [projectWhitePaperDataURL, setProjectWhitePaperDataURL] = useState("");
  const [payload, setPayload] = useState({});
  const { data: projectPayload, error } = useSWR(Object.keys(payload).length > 0 && "/api/projects", url=>fetcher(url,{
    ...defaultOption,
    method: "POST",
    body: JSON.stringify({
      ...payload
    })
  }))
  const { data } = useSWR(projectPayload && "/api/updateFile", url=>fetcher(url,{
    ...defaultOption,
    method: "POST",
    body: JSON.stringify({
      "projectWhitePaper": projectWhitePaperDataURL,
      "projectImage": projectImageDataURL,
      "projectId": projectPayload["content"]["_id"]
    })
  }));
  if ( data || projectPayload ) {
    let router = useRouter();
    router.push(`/${projectPayload["content"]["_id"]}`);
  }
  const handleSubmit = (value: any, action: any) => {
    // e.preventDefault();
    console.log(value);
    setProjectImageDataURL(projectImage[0].getFileEncodeDataURL());
    setProjectWhitePaperDataURL(projectWhitePaper[0].getFileEncodeDataURL());
    setPayload({
  	"receiverWallet":
    	{
    		"address": value.receiverWalletAddress,
    		"balance": "0"
    	},
    	"receiverName": value.receiverName,
    	"projectName": value.projectName,
    	"projectDescciption": value.projectDescciption,
    	"projectImageURL": "",
    	"projectWhitePaperURL": "",
    	"targetAmount": value.targetAmount,
    	"raisedAmount": "0",
    	"createdDate":""
    })
  }
  const handleInit = () => {
    console.log('FilePond instance has initialised');
  }

  return (
    <BasicLayout key="list">
    <link href="https://unpkg.com/filepond/dist/filepond.css" rel="stylesheet"/>
    <link href="https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css" rel="stylesheet"/>

      <Formik
        initialValues={{
          receiverWalletAddress: "",
          receiverName: "",
          projectName: "",
          projectDescciption: "",
          targetAmount: 0,
        }}
        validationSchema={Yup.object().shape({
          receiverWalletAddress: Yup.string().required("This field is required"),
          receiverName: Yup.string().required("This field is required"),
          projectName: Yup.string().max(255).required("This field is required"),
          projectDescciption: Yup.string().max(255).min(10).required("This field is required"),
          targetAmount: Yup.number().required("This field is required"),
        })}
        onSubmit={handleSubmit}
      >
      {
        formikProps =>(
          <Form
          onReset={formikProps.handleReset}
          onSubmit={formikProps.handleSubmit}
          >
          <Grid container>
            <Grid item xs={12} style={{...globalStyle.centerContent}}>
              <FilePond
                files={projectImage}
                oninit={() => handleInit() }
                onupdatefiles={fileItems => {
                  setProjectImage(fileItems);
                  console.log("fileItems", fileItems);
                }}
                style={{height: 20}}
                allowFileSizeValidation
                allowFileTypeValidation
                maxFileSize="10MB"
                labelMaxFileSizeExceeded="The max size of image is 10MB"
                acceptedFileTypes={["image/png", "image/jpg", "image/jpeg"]}
                labelFileTypeNotAllowed="Input must be a image file"
                >
              </FilePond>
            </Grid>
            <Grid item xs={12} style={{...globalStyle.centerContent}}>
              <TextInputField
                name="receiverWalletAddress" />
            </Grid>
            <Grid item xs={12} style={{...globalStyle.centerContent}}>
              <TextInputField
                name="receiverName" />
            </Grid>
            <Grid item xs={12} style={{...globalStyle.centerContent}}>
              <TextInputField
                name="projectName" />
            </Grid>
            <Grid item xs={12} style={{...globalStyle.centerContent}}>
            <TextInputField
              name="projectDescciption" />
            </Grid>
            <Grid item xs={12} style={{...globalStyle.centerContent}}>
              <TextInputField
                name="targetAmount" />
            </Grid>
            <Grid item xs={12} style={{...globalStyle.centerContent}}>
              <FilePond
                files={projectWhitePaper}
                oninit={() => handleInit() }
                onupdatefiles={fileItems => {
                  setProjectWhitePaper(fileItems);
                  console.log("fileItems", fileItems);
                }}
                allowFileSizeValidation
                allowFileTypeValidation
                maxFileSize="10MB"
                labelMaxFileSizeExceeded="The max size of PDF is 10MB"
                acceptedFileTypes={["application/pdf"]}
                labelFileTypeNotAllowed="Input must be a PDF"
                style={{ ...globalStyle.centerContent, height: 20}}
                >
              </FilePond>
            </Grid>
            <Grid item xs={12} style={{...globalStyle.centerContent}}>
              <button type="submit" style={{marginLeft: "35%", marginTop: 10}}>
              Submit
              </button>
              <button type="reset" style={{marginLeft: "10%", marginTop: 10}}>
                reset
              </button>
            </Grid>
          </Grid>
          </Form>
        )
      }
      </Formik>
    </BasicLayout>
  )
}
export default Page;
