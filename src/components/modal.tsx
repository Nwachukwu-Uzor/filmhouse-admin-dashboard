import React, { FC, ReactNode, MouseEvent } from "react";

interface ModalProps {
  open: boolean;
  handleClose: (event: MouseEvent) => void;
  children?: ReactNode;
}

export const Modal: FC<ModalProps> = ({ children, open, handleClose }) => {
  return (
    <>
      {open ? (
        <div className="fixed left-0 top-0 bottom-0 z-30 right-0 flex items-center justify-center duration-200">
          <div
            className="absolute inset-0 border-2 border-red-500 bg-black/75 z-40"
            onClick={handleClose}
          ></div>
          <div
            className={`relative z-50 w-fit flex items-center justify-center ${
              open ? "translate-y-0" : "translate-y-[50vh]"
            }`}
          >
            {children}
          </div>
        </div>
      ) : null}
    </>
  );
};
