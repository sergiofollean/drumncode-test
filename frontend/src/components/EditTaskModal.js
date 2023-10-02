import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import axios from '@/lib/axios'
import AddTaskModal from '@/components/AddTaskModal'

import SortableTasks from '@/components/SortableTasks'

const EditTaskModal = ({ isOpen, onClose, onTaskUpdated, task }) => {
    const [title, setTitle] = useState(task.title)
    const [description, setDescription] = useState(task.description)
    const [status, setStatus] = useState(task.status)

    const [subtasks, setSubtasks] = useState([])
    const [addSubtaskModalOpen, setAddSubtaskModalOpen] = useState(false)

    const updateSubtasks = () => {
        axios
            .get(`/api/tasks`, {
                params: {
                    parent_id: task.id,
                },
            })
            .then(response => {
                setSubtasks(response.data)
            })
    }

    useEffect(() => {
        if (!isOpen) {
            return
        }

        updateSubtasks()
    }, [isOpen])

    const onSubmit = e => {
        e.preventDefault()

        axios
            .put(`/api/tasks/${task.id}`, {
                title,
                description,
                status,
            })
            .then(() => {
                onTaskUpdated()
                onClose()
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
                            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="modal-headline">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="mb-5 text-center sm:mt-0 sm:text-left w-full">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg leading-6 font-medium text-gray-900">
                                        Edit task {title}
                                    </Dialog.Title>
                                </div>
                                {/* Form with input title, textarea description */}
                                <div className="flex flex-wrap mb-6 gap-5">
                                    <div className="mb-6 md:mb-0">
                                        <label className="block text-sm font-medium leading-6 text-gray-900">
                                            Date created
                                        </label>
                                        <div className="mt-1">
                                            <p className="text-sm text-gray-500">
                                                {new Date(
                                                    task.created_at,
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {task.status === 'done' && (
                                        <div className="mb-6 md:mb-0">
                                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                                Date completed
                                            </label>
                                            <div className="mt-1">
                                                <p className="text-sm text-gray-500">
                                                    {new Date(
                                                        task.updated_at,
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}

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

                                    <div className="w-full mb-6 md:mb-0">
                                        <label
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                            htmlFor="new_task_done">
                                            Done
                                        </label>
                                        <input
                                            type="checkbox"
                                            id="hs-basic-usage"
                                            className="relative w-[3.25rem] h-7 bg-gray-100 checked:bg-none checked:bg-blue-600 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 border border-transparent ring-1 ring-transparent focus:border-blue-600 focus:ring-blue-600 ring-offset-white focus:outline-none appearance-none dark:bg-gray-700 dark:checked:bg-blue-600 dark:focus:ring-offset-gray-800 before:inline-block before:w-6 before:h-6 before:bg-white checked:before:bg-blue-200 before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-gray-400 dark:checked:before:bg-blue-200"
                                            checked={status === 'done'}
                                            onChange={e =>
                                                setStatus(
                                                    e.target.checked
                                                        ? 'done'
                                                        : 'todo',
                                                )
                                            }
                                        />
                                        <label
                                            htmlFor="hs-basic-usage"
                                            className="sr-only">
                                            switch
                                        </label>
                                    </div>

                                    <div className="w-full mb-6 md:mb-0">
                                        <label
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                            htmlFor="new_task_done">
                                            Subtasks
                                            <a
                                                className={
                                                    'cursor-pointer ml-2 rounded-md bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                                }
                                                onClick={e => {
                                                    e.preventDefault()
                                                    setAddSubtaskModalOpen(true)
                                                }}>
                                                Add subtask
                                            </a>
                                            <AddTaskModal
                                                isOpen={addSubtaskModalOpen}
                                                onClose={() =>
                                                    setAddSubtaskModalOpen(
                                                        false,
                                                    )
                                                }
                                                onTaskAdded={updateSubtasks}
                                                parentTask={task}
                                            />
                                        </label>
                                        <div
                                            className={
                                                'mt-2 shadow-sm sm:rounded-lg p-6 border border-gray-200'
                                            }>
                                            <SortableTasks
                                                tasks={subtasks}
                                                setTasks={setSubtasks}
                                                onTasksUpdated={updateSubtasks}
                                            />

                                            {!subtasks.length && (
                                                <p
                                                    className={
                                                        'text-sm text-gray-500'
                                                    }>
                                                    No subtasks yet
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-x-6">
                                        <button
                                            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            type="submit"
                                            onClick={onSubmit}>
                                            Save
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

export default EditTaskModal
