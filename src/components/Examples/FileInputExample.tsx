import { useState } from "react";
import FileInput from "../FileInput";

export default function FileInputExample() {
  const [fileName, setFileName] = useState("");

  return (
    <FileInput
      accept="image/*,.png,.jpg"
      CustomInput={({ isDragOver }) => (
        <div className="flex leading-5 gap-3 w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400">
          <div className="text-white rounded-l-md bg-green-400 py-2 px-3 pointer-events-none">Выберите файл</div>
          <div className="flex items-center pointer-events-none">
            {!isDragOver && fileName}
            {!isDragOver && !fileName && "Файл не выбран"}
            {isDragOver && "Отпустите для загрузки"}
          </div>
        </div>
      )}
      onFilesSelect={(files) => {
        const fileName = files[0].name;

        setFileName(fileName)
      }}
    />
  );
}
