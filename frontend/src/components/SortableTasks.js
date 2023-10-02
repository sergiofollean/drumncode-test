import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import SortableTask from '@/components/SortableTask'
import axios from '@/lib/axios'

const SortableTasks = ({ tasks, setTasks, onTasksUpdated }) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    const handleDragEnd = event => {
        const { active, over } = event
        if (active.id !== over.id) {
            setTasks(tasks => {
                const oldIndex = tasks.findIndex(task => task.id === active.id)
                const newIndex = tasks.findIndex(task => task.id === over.id)
                const reorderedTasks = arrayMove(tasks, oldIndex, newIndex)

                reorderedTasks.forEach((task, index) => {
                    task.priority = index + 1
                })

                axios.put('/api/tasks', {
                    tasks: reorderedTasks,
                })

                return reorderedTasks
            })
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
                items={tasks.map(task => task.id)}
                strategy={verticalListSortingStrategy}>
                {tasks.map(task => (
                    <SortableTask
                        key={task.id}
                        task={task}
                        updateTasks={onTasksUpdated}
                    />
                ))}
            </SortableContext>
        </DndContext>
    )
}

export default SortableTasks
