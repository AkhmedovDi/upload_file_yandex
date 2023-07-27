import {useDropzone} from 'react-dropzone';
import { useState } from 'react';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react'
export default function Home() {


  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);

  const onDrop = (acceptedFiles: any) => {
    const maxFiles = 100;
    const remainingSlots = maxFiles - selectedFiles.length;
    const filesToAdd = acceptedFiles.slice(0, remainingSlots);
    setSelectedFiles([...selectedFiles, ...filesToAdd]);
  }

  const session = useSession()
  console.log(session)

  const handleRemoveFile = (index: any) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const handleUpload = async () => {
    const token = session?.data?.accessToken
    const folderPath = ''

 
    for (const file of selectedFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('url', '/')

        const response = await axios.get(`https://cloud-api.yandex.net/v1/disk/resources/upload?path=${folderPath}/${file.name}`,
          {
            headers: {
              Authorization: `OAuth ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        await axios.put(response.data.href, file)
        // alert('файл успешно добавлен!')
      } catch (error) {
        console.error('Error uploading file:', file.name, error);
      }
    }
    setSelectedFiles([]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "*" as any,
    multiple: true,
  })

  return (
    <div className='app'>
      {session?.data?.accessToken ? null
      : (
        <div className='header'>
          <h2>чтобы загрузить файл сначала войдите в аккаунт</h2>
          <button 
            onClick={() => signIn('yandex', {
              redirect: false
            })}
              className='btn_sign_in'
            >
                  Войти через Яндекс 
          </button>
        </div>
        )
    }

      <div {...getRootProps()} 
        className='upload_file'
      >
        <p>Загрузить файл</p>
      <input {...getInputProps()} />
      </div>
      <div className='files'>
        <h3>Имя файла</h3>
        <ul>
          {selectedFiles.map((file, index) => (
            <li key={index}>
              {index + 1}. {file.name}
              <button 
                className='btn_delete_file' 
                onClick={() => handleRemoveFile(index)}
              >
                Удалить файл
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selectedFiles.length > 0 && (
        <button className='btn_send_files' onClick={handleUpload}>Загрузить файлы на Яндекс Диск</button>
      )}
    </div>
  );
}
