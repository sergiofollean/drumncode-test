import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import axios from '@/lib/axios'

const AddTaskModal = ({ isOpen, onClose, onTaskAdded, parentTask }) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const parent_id = parentTask ? parentTask.id : 0

    const onSubmit = e => {
        e.preventDefault()

        axios
            .post('/api/tasks', {
                title,
                description,
                parent_id,
            })
            .then(() => {
                onClose()
                onTaskAdded()
                setTitle('')
                setDescription('')
            })
            .catch(error => {
                alert(error.response.data.message)
            })
    }

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed z-10 inset-0 overflow-y-auto"
                onClose={onClose}>
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <Dialog.Overlay
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={onClose}
                        />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <div
                            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="modal-headline">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="mb-5 text-center sm:mt-0 sm:text-left w-full">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg leading-6 font-medium text-gray-900">
                                        Add new task
                                        {parentTask
                                            ? ` to ${parentTask.title}`
                                            : ''}
                                    </Dialog.Title>
                                </div>
                                {/* Form with input title, textarea description */}
                                <div className="flex flex-wrap mb-6 gap-5">
                                    <div className="w-full mb-6 md:mb-0">
                                        <label
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                            htmlFor="new_task_title">
                                            Title
                                        </label>
                                        <input
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            id="new_task_title"
                                            type="text"
                                            placeholder="Title"
                                            value={title}
                                            onChange={e =>
                                                setTitle(e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="w-full mb-6 md:mb-0">
                                        <label
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                            htmlFor="new_task_description">
                                            Description
                                        </label>
                                        <textarea
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            id="new_task_description"
                                            placeholder="Description"
                                            value={description}
                                            onChange={e =>
                                                setDescription(e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center justify-end gap-x-6">
                                        <button
                                            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            type="submit"
                                            onClick={onSubmit}>
                                            Add task
                                        </button>

                                        <button
                                            className="text-sm font-semibold leading-6 text-gray-900"
                                            type="button"
                                            onClick={onClose}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default AddTaskModal
