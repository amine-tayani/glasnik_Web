/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Fragment, useCallback, useRef, useState } from "react";
import { Dialog, Transition, Tab } from "@headlessui/react";
import { XIcon, CameraIcon } from "@heroicons/react/outline";
import { useMutation } from "@apollo/client";
import { useForm, useController } from "react-hook-form";
import SwitchAccess from "./Switch";
import {
  CREATE_COMMUNITY,
  JOIN_COMMUNITY,
} from "../../graphql/mutations/community";
import GET_CURRENT_USER from "../../graphql/queries/currentUser";

const CreateChannelDialog = ({ open, setOpen }) => {
  const [isPrivate, changePrivacy] = useState(false);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const { handleSubmit, register, control } = useForm({ mode: "onBlur" });

  const [createCommunity, { error }] = useMutation(CREATE_COMMUNITY, {
    onCompleted: (data) => console.log(data),
    refetchQueries: [{ query: GET_CURRENT_USER, pollInterval: 200 }],
  });

  const [joinCommunity] = useMutation(JOIN_COMMUNITY, {
    onCompleted: (data) => console.log(data),
    refetchQueries: [{ query: GET_CURRENT_USER, pollInterval: 200 }],
  });
  const avatarRef = useRef(null);

  const openAvatarUploadBox = useCallback(() => {
    avatarRef.current.click();
  }, []);

  const FileInput = ({ control, name }) => {
    const { field } = useController({ control, name });
    return (
      <>
        <input
          hidden
          onChange={(e) => {
            field.onChange(e.target.files[0]);
          }}
          type="file"
          ref={avatarRef}
          accept="image/*"
        />
        <a
          data-tooltip="Upload avatar"
          data-flow="bottom"
          onClick={openAvatarUploadBox}
          className="focus:outline-none flex justify-center items-center cursor-pointer h-12 w-12 p-3 rounded-r-lg group bg-[#36393F] hover:bg-[#4a494d] text-gray-400 "
        >
          <CameraIcon className="h-8 w-8 text-gray-400 group-hover:text-white " />
        </a>
      </>
    );
  };

  const createNewCommunity = async (data) => {
    console.log(data);
    try {
      await createCommunity({
        variables: {
          type: isPrivate ? "PRIVATE" : "PUBLIC",
          name: data.name,
          category: data.category,
          thumbUrl: data.file,
        },
      });
      setOpen(false);
    } catch (e) {
      console.log(e.message);
    }
  };

  const joinAnExistingCommunity = async (data) => {
    console.log(data);
    try {
      await joinCommunity({
        variables: {
          name: data.cname,
        },
      });
      setOpen(false);
    } catch (e) {
      console.log(e.message);
    }
  };
  if (error) {
    console.log(error.networkError?.result);
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        className="fixed z-10 text-white inset-0 font-inter overflow-y-auto"
        open={open}
        onClose={() => setOpen(false)}
      >
        <div className="flex items-center justify-center min-h-[700px]">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 opc" />
          </Transition.Child>
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative bg-[#202227] rounded-xl w-200 h-1/3 mx-auto px-4 py-2 ">
              <button
                onClick={() => setOpen(false)}
                className="absolute focus:outline-none right-0 top-6 flex mx-8 justify-center items-center cursor-pointer h-10 w-10 p-3 rounded-xl group bg-[#25272b] hover:bg-[#4a494d] "
              >
                <XIcon className="h-8 w-8 text-gray-400 group-hover:text-white " />
              </button>
              <Tab.Group>
                <Tab.List className="m-4 flex justify-center w-1/2 text-sm transform transition duration-500 ease-in-out bg-[#36393F] hover:bg-[#373738] hover:text-white font-medium focus:outline-none rounded-full">
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        "w-full py-2.5 text-[13px] leading-5 font-medium text-gray-100 rounded-full focus:outline-none ",
                        selected
                          ? "bg-white text-gray-700 shadow transition duration-300 ease-in-out"
                          : "text-gray-100 hover:bg-white/[0.12] hover:text-white"
                      )
                    }
                  >
                    Create Server
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        "w-full py-2.5 text-[13px] leading-5 font-medium text-gray-100 rounded-full focus:outline-none",
                        selected
                          ? "bg-white shadow text-gray-700 transition duration-300 ease-in-out"
                          : "text-gray-100 hover:bg-white/[0.12] hover:text-white"
                      )
                    }
                  >
                    Join Server
                  </Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    <form onSubmit={handleSubmit(createNewCommunity)}>
                      <div className="flex ml-2 mt-14 justify-center">
                        <input
                          {...register("name", {
                            required:
                              "*Field is required. Please fill in field",
                            minLength: {
                              value: 5,
                              message:
                                "*Server name must be at least 5 characters long.",
                            },
                          })}
                          onFocus={(e) => {
                            e.target.placeholder = "";
                          }}
                          onBlur={(e) => {
                            e.target.placeholder =
                              "Type the name of the server";
                          }}
                          name="name"
                          type="text"
                          className="bg-[#36393F] rounded-l-lg text-sm appearance-none w-96 px-4 py-3 leading-tight focus:outline-none text-gray-300 placeholder-gray-400 "
                          placeholder="Type the name of the server"
                        />
                        <div>
                          <FileInput name="file" control={control} />
                        </div>
                      </div>

                      <div className="flex justify-center pl-2 mt-6">
                        <input
                          {...register("category", {
                            required:
                              "*Field is required. Please fill in field",
                          })}
                          onFocus={(e) => {
                            e.target.placeholder = "";
                          }}
                          onBlur={(e) => {
                            e.target.placeholder = "Write the category ";
                          }}
                          name="category"
                          type="text"
                          className="bg-[#36393F] rounded-lg text-sm appearance-none w-[430px] px-4 py-[14px] leading-tight focus:outline-none text-gray-300 placeholder-gray-400"
                          placeholder="Write the category"
                        />
                      </div>

                      <div className="flex justify-between -mt-8 mx-4 items-center">
                        <div className="flex items-center space-x-4">
                          <SwitchAccess
                            isprivate={isPrivate}
                            setPrivate={changePrivacy}
                          />
                          <span className="text-sm text-gray-300 font-medium">
                            Private
                          </span>
                        </div>
                        <button
                          type="submit"
                          className="w-1/5 py-2 rounded-lg text-sm transform transition duration-500 ease-in-out bg-[#0071FF] text-gray-100 font-medium focus:outline-none "
                        >
                          Create
                        </button>
                      </div>
                    </form>
                  </Tab.Panel>
                  <Tab.Panel>
                    <form onSubmit={handleSubmit(joinAnExistingCommunity)}>
                      <div className="flex justify-center my-8">
                        <input
                          {...register("cname", {
                            required:
                              "*Field is required. Please fill in field",
                          })}
                          onFocus={(e) => {
                            e.target.placeholder = "";
                          }}
                          onBlur={(e) => {
                            e.target.placeholder =
                              "Write name of the community to join";
                          }}
                          name="cname"
                          type="text"
                          className="bg-[#36393F] rounded-lg text-sm appearance-none w-[430px] px-4 py-[14px] leading-tight focus:outline-none text-gray-300 placeholder-gray-400"
                          placeholder="Write name of the community to join"
                        />
                      </div>
                      <button
                        type="submit"
                        className="mb-4 mx-4 w-1/5 py-2 rounded-lg text-sm transform transition duration-500 ease-in-out bg-[#0071FF] text-gray-100 font-medium focus:outline-none "
                      >
                        join
                      </button>
                    </form>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
export default CreateChannelDialog;
