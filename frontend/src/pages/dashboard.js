import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import axios from '@/lib/axios'
import { useEffect, useState } from 'react'
import AddTaskModal from '@/components/AddTaskModal'
// font awesome search icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons'

import SortableTasks from '@/components/SortableTasks'

const Dashboard = () => {
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [todoTasks, setTodoTasks] = useState([])
    const [doneTasks, setDoneTasks] = useState([])

    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [date, setDate] = useState('')

    const updateTasks = () => {
        setLoading(true)

        axios.get('/api/tasks').then(response => {
            setTodoTasks(
                response.data
                    .filter(task => task.status === 'todo')
                    .sort((a, b) => a.priority - b.priority),
            )
            setDoneTasks(
                response.data
                    .filter(task => task.status === 'done')
                    .sort((a, b) => a.priority - b.priority),
            )
            setLoading(false)
        })
    }

    useEffect(() => {
        updateTasks()
    }, [])

    useEffect(() => {
        search && setLoading(true)

        let timer = setTimeout(() => {
            axios
                .get(`/api/tasks`, {
                    params: {
                        search,
                    },
                })
                .then(response => {
                    setTodoTasks(
                        response.data
                            .filter(task => task.status === 'todo')
                            .sort((a, b) => a.priority - b.priority),
                    )
                    setDoneTasks(
                        response.data
                            .filter(task => task.status === 'done')
                            .sort((a, b) => a.priority - b.priority),
                    )
                    setLoading(false)
                })
        }, 1000)

        return () => clearTimeout(timer)
    }, [search])

    useEffect(() => {
        date && setLoading(true)

        axios
            .get(`/api/tasks`, {
                params: {
                    date,
                },
            })
            .then(response => {
                setTodoTasks(
                    response.data
                        .filter(task => task.status === 'todo')
                        .sort((a, b) => a.priority - b.priority),
                )
                setDoneTasks(
                    response.data
                        .filter(task => task.status === 'done')
                        .sort((a, b) => a.priority - b.priority),
                )
                setLoading(false)
            })
    }, [date])

    return (
        <AppLayout
            header={
                <div className={'flex items-center'}>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight flex-1">
                        Todo list
                    </h2>
                    <button
                        className={
                            'rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        }
                        onClick={() => setAddModalOpen(true)}>
                        Add task
                    </button>
                    <AddTaskModal
                        isOpen={addModalOpen}
                        onClose={() => setAddModalOpen(false)}
                        onTaskAdded={updateTasks}
                    />
                </div>
            }>
            <Head>
                <title>Laravel - Dashboard</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Search bar */}
                    <div className="mb-4 sm:flex">
                        <label htmlFor="search" className="sr-only">
                            Search
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                {loading ? (
                                    <FontAwesomeIcon
                                        icon={faSpinner}
                                        className={'text-gray-400 animate-spin'}
                                    />
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faSearch}
                                        className={'text-gray-400'}
                                    />
                                )}
                            </div>
                            <input
                                type="text"
                                name="search"
                                id="search"
                                className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Search"
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="mt-3 sm:mt-0 sm:ml-3">
                            <label htmlFor="date" className="sr-only">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                id="date"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Date"
                                onChange={e => setDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={'grid sm:grid-cols-2 gap-5'}>
                        <div className="bg-white shadow-sm sm:rounded-lg p-6 border-b border-gray-200">
                            <h2>To do</h2>

                            <div className={'mt-5 inline-block w-full gap-4'}>
                                <SortableTasks
                                    tasks={todoTasks}
                                    setTasks={setTodoTasks}
                                    onTasksUpdated={updateTasks}
                                />

                                {!todoTasks.length && (
                                    <div
                                        className={
                                            'text-center text-gray-400 mt-4'
                                        }>
                                        No tasks to do yet
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white shadow-sm sm:rounded-lg p-6 border-b border-gray-200">
                            <h2>Done</h2>

                            <div className={'mt-5 inline-block w-full'}>
                                <SortableTasks
                                    tasks={doneTasks}
                                    setTasks={setDoneTasks}
                                    onTasksUpdated={updateTasks}
                                />

                                {!doneTasks.length && (
                                    <div
                                        className={
                                            'text-center text-gray-400 mt-4'
                                        }>
                                        No tasks done yet
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default Dashboard
