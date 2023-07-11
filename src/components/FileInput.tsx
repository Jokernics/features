import { memo, useRef, useState } from "react";

type props = {
  containerClass?: string;
  onFilesSelect?: (e: FileList | File[]) => void;
  multiple?: boolean;
  accept?: string;
  CustomInput?: (({ isDragOver }: { isDragOver: boolean }) => JSX.Element) | null;
};

const vaildateFile = (type: string, regexp: string) => regexp.split(",").some((reg) => new RegExp(reg, "").test(type));

export default memo(function FileInput({
  containerClass = "",
  onFilesSelect = () => {},
  multiple = false,
  accept = "",
  CustomInput = null,
}: props) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    setIsDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    setIsDragOver(false);

    const files = e.dataTransfer.files;
    let validatedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isValid = vaildateFile(file.type, accept);

      if (isValid) validatedFiles.push(file);
    }

    if (validatedFiles.length && !multiple) validatedFiles.length = 1;

    if (validatedFiles.length) handleSelectedFiled(validatedFiles);
  };

  const onClick = () => {
    if (fileInput.current) fileInput.current.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) handleSelectedFiled(files);

    if (fileInput.current) fileInput.current.value = "";
  };

  const handleSelectedFiled = (files: FileList | File[]) => {
    onFilesSelect(files);
  };

  const listeners = { onDragLeave, onDragOver, onDrop, onClick };

  return (
    <div {...listeners}>
      {CustomInput ? (
        <CustomInput {...{ isDragOver }} />
      ) : (
        <div
          className={`
            flex justify-center items-center w-full border-2 border-dotted px-1 py-4 rounded-md transition-all hover:bg-gray-100 cursor-pointer
            ${containerClass}
          `}
        >
          <h5 className="pointer-events-none">
            {isDragOver ? "Отпустите файлы для загрузки" : "Выберите или перетащите файлы для загрузки"}
          </h5>
        </div>
      )}
      <input type="file" multiple={multiple} ref={fileInput} className="hidden" onChange={handleInputChange} accept={accept} />
    </div>
  );
});
