import React, { useEffect, useState } from "react";
import { MdAdd, MdGroup, MdSearch, MdSync } from "react-icons/md";
import Dialog from "../components/Dialog";
import type { Reader } from "../types/Reader";
import ReaderTable from "../components/tables/ReaderTable";
import ReaderForm from "../components/forms/ReaderForm";
import axios from "axios";
import toast from "react-hot-toast";
import { addReader, deleteReader, getAllReaders, updateReader } from "../services/readerService";
import { useSocket } from "../hooks/useSocket";

const ReadersPage: React.FC = () => {
  const [readers, setReaders] = useState<Reader[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isReadersLoading, setIsReadersLoading] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReader, setSelectedReader] = useState<Reader | null>(null);

  const fetchAllReaders = async () => {
    try {
      setIsReadersLoading(true);
      const result = await getAllReaders();
      setReaders(result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message);
      } else {
        toast.error("Failed to load members");
      }
    } finally {
      setIsReadersLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReaders();
  }, []);

  useSocket(fetchAllReaders);

  const handleAddReader = () => {
    setSelectedReader(null);
    setIsAddDialogOpen(true);
  };

  const handleEditReader = (reader: Reader) => {
    setSelectedReader(reader);
    setIsEditDialogOpen(true);
  };

  const handleDeleteReader = (reader: Reader) => {
    setSelectedReader(reader);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (readerData: Omit<Reader, "_id">) => {
    if (selectedReader && selectedReader._id) {
      try {
        const updatedReader = await updateReader(selectedReader._id, readerData);
        setReaders((prev) =>
          prev.map((reader) => (reader._id === selectedReader._id ? updatedReader : reader))
        );
        toast.success("Member details updated");
        setIsEditDialogOpen(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Failed to update member");
        }
      }
    } else {
      try {
        const newReader = await addReader(readerData);
        setReaders((prev) => [...prev, newReader]);
        toast.success("New member registered");
        setIsAddDialogOpen(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Failed to register member");
        }
      }
    }
    setSelectedReader(null);
  };

  const confirmDelete = async () => {
    if (selectedReader && selectedReader._id) {
      try {
        await deleteReader(selectedReader._id);
        toast.success("Member record removed");
        fetchAllReaders();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Failed to delete member");
        }
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedReader(null);
      }
    }
  };

  const cancelDialog = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedReader(null);
  };

  const filteredReaders = readers.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-emerald-500/10 backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <MdGroup className="w-4 h-4" />
            <span>CeylonShelf Members Directory</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Library Members</h1>
          <p className="text-xs text-slate-400 mt-1">Manage registered readers, contact details, and branch memberships</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchAllReaders}
            className="p-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition cursor-pointer"
            title="Refresh Directory"
          >
            <MdSync className={`w-5 h-5 ${isReadersLoading ? "animate-spin text-emerald-400" : ""}`} />
          </button>
          <button
            onClick={handleAddReader}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-4.5 py-2.5 rounded-xl font-extrabold text-sm transition shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <MdAdd className="w-5 h-5" />
            <span>Register New Member</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800/80 flex items-center space-x-3 shadow-inner">
        <MdSearch className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search members by name, email, phone number, or city address..."
          className="bg-transparent border-none text-slate-200 text-sm focus:outline-none w-full placeholder-slate-500"
        />
      </div>

      {isReadersLoading && (
        <div className="p-12 text-center text-slate-400 font-medium animate-pulse">
          Loading CeylonShelf member profiles...
        </div>
      )}

      {!isReadersLoading && (
        <ReaderTable readers={filteredReaders} onEdit={handleEditReader} onDelete={handleDeleteReader} />
      )}

      <Dialog
        isOpen={isAddDialogOpen}
        onCancel={cancelDialog}
        onConfirm={() => {
          const form = document.querySelector("form") as HTMLFormElement;
          if (form) form.requestSubmit();
        }}
        title="Register New Library Member"
      >
        <ReaderForm onSubmit={handleFormSubmit} />
      </Dialog>

      <Dialog
        isOpen={isEditDialogOpen}
        onCancel={cancelDialog}
        onConfirm={() => {
          const form = document.querySelector("form") as HTMLFormElement;
          if (form) form.requestSubmit();
        }}
        title="Update Member Profile"
      >
        <ReaderForm reader={selectedReader} onSubmit={handleFormSubmit} />
      </Dialog>

      <Dialog isOpen={isDeleteDialogOpen} onCancel={cancelDialog} onConfirm={confirmDelete} title="Revoke Member Card">
        <p className="text-slate-300 text-sm leading-relaxed">
          Are you sure you want to remove <strong className="text-white">{selectedReader?.name}</strong> from CeylonShelf membership?
        </p>
      </Dialog>
    </div>
  );
};

export default ReadersPage;