import { useCallback, useState } from "react"
import { FileWithPath, useDropzone } from 'react-dropzone'
import { Button } from "../ui/button";

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
}

const FileUploader = ({ fieldChange, mediaUrl}: FileUploaderProps) => {
  
  const [fileUrl, setFileUrl] = useState(mediaUrl);
  const [file, setFile] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
  }, [file]);

  const {getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*' : ['.png', '.jpg', '.jpeg', '.gif', '.svg']
    }
  });


  return (
    <div {...getRootProps()} className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer">
      <input {...getInputProps()} className="cursor-pointer" />
      {
        fileUrl ? (
          <>
          
            <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
              <img 
                src={fileUrl}
                alt="file" 
                className="file_uploader-img"
              />
            </div>
            <p>Click or drag photo to replace</p>
          </>
        ) : (
          <div className="file_uploader-box">
            <img 
              src="/assets/icons/file-upload.svg" 
              alt="add-file" 
              width={96}
              height={77}
            />
            <h3 className="base-medium text-light-2 mb-2 mt-4">Drag file here</h3>
            <p className="text-light-4 small-regular mb-6">svg, jpg, png</p>

            <Button className="bg-gray-700 hover:bg-gray-800">
              Add File
            </Button>

          </div>
        )
      }
    </div>
  )
}

export default FileUploader
