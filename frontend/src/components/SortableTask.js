import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGripVertical, faTrash } from '@fortawesome/free-solid-svg-icons'

import EditTaskModal from '@/components/EditTaskModal'
import axios from '@/lib/axios'

const SortableTask = ({ task, updateTasks }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: task.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const [editModalOpen, setEditModalOpen] = useState(false)

    const deleteTask = e => {
        e.stopPropagation()

        axios.delete(`/api/tasks/${task.id}`).then(() => {
            updateTasks()
        })
    }

    return (
        <div ref={setNodeRef} style={style}>
            <div
                className="bg-white overflow-hidden sm:rounded-lg p-6 border border-gray-200 mt-4 flex cursor-pointer"
                onClick={() => setEditModalOpen(true)}>
                <a {...attributes} {...listeners} className={'cursor-move'}>
                    <FontAwesomeIcon
                        icon={faGripVertical}
                        className={'text-gray-400 mr-2 hover:scale-125'}
                    />
                </a>

                <h3>{task.title}</h3>

                {task.status !== 'done' ? (
                    <a
                        className={'ml-auto'}
                        onClick={deleteTask}
                        title={'Delete task'}>
                        <FontAwesomeIcon
                            icon={faTrash}
                            className={'text-gray-400 ml-2 hover:text-red-500'}
                        />
                    </a>
                ) : (
                    <div className={'ml-auto'}>
                        <span className={'text-green-500'}>Done</span>
                    </div>
                )}
            </div>

            <EditTaskModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onTaskUpdated={updateTasks}
                task={task}
            />
        </div>
    )
}

export default SortableTask
