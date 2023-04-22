import React, {
  FC,
  ChangeEvent,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";
import { Header, Button, Modal, TextInput } from "../components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

interface DeleteItemModalProps {
  //   setIsLoading: Dispatch<SetStateAction<boolean>>;
  //   handleDelete: <T>(data?: T) => Promise<void>;
  children: ReactNode;
  handleToggleDeleteModal: () => void;
  openDeleteModal: boolean;
}

export const DeleteItemModal: FC<DeleteItemModalProps> = ({
  openDeleteModal,
  handleToggleDeleteModal,
  children,
}) => {
  return (
    <>
      <Modal open={openDeleteModal} handleClose={handleToggleDeleteModal}>
        {children}
      </Modal>
    </>
  );
};
