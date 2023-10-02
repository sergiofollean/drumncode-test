<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'parent_id' => 'nullable|integer',
            'search' => 'nullable|string',
            'date' => 'nullable|date',
        ]);

        if ($request->parent_id) {
            $tasks = Task::where('user_id', auth()->user()->id)->where('parent_id', $request->parent_id)->orderBy('priority')->get();
            return response()->json($tasks);
        }

        if ($request->search) {
            $tasks = Task::where('user_id', auth()->user()->id)->where('parent_id', 0)->where('title', 'like', '%' . $request->search . '%')->orderBy('priority')->get();
            return response()->json($tasks);
        }

        if ($request->date) {
            $tasks = Task::where('user_id', auth()->user()->id)->where('parent_id', 0)->whereDate('created_at', $request->date)->orderBy('priority')->get();
            return response()->json($tasks);
        }

        $tasks = Task::where('user_id', auth()->user()->id)->where('parent_id', 0)->orderBy('priority')->get();
        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|max:100',
            'description' => 'required',
            'parent_id' => 'nullable|integer',
        ]);

        if ($request->parent_id) {
            $parentTask = Task::where('id', $request->parent_id)->where('user_id', auth()->user()->id)->first();

            if (!$parentTask) {
                return response()->json(['message' => 'Parent task not found'], 404);
            }

            if ($parentTask->status === 'done') {
                return response()->json(['message' => 'Parent task is completed, you can\'t add more tasks'], 400);
            }
        }

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'priority' => 0,
            'user_id' => auth()->user()->id,
            'parent_id' => $request->parent_id ?? 0,
        ]);
        return response()->json($task);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|max:100',
            'description' => 'required',
            'status' => 'required|in:todo,done',
        ]);
        $task = Task::where('id', $id)->where('user_id', auth()->user()->id)->first();

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        if ($task->parent_id !== 0) {
            $parentTask = Task::where('id', $task->parent_id)->where('user_id', auth()->user()->id)->first();

            if (!$parentTask) {
                return response()->json(['message' => 'Parent task not found'], 404);
            }

            if ($parentTask->status === 'done') {
                return response()->json(['message' => 'Parent task is completed, you can\'t update this task'], 400);
            }
        }

        if ($request->status === 'done') {
            $todoSubtasks = Task::where('parent_id', $id)->where('status', 'todo')->count();

            if ($todoSubtasks > 0) {
                return response()->json(['message' => 'Task has subtasks that are not completed'], 400);
            }
        }

        Task::where('id', $id)->where('user_id', auth()->user()->id)->update([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'completed_at' => $request->status === 'done' ? now() : null,
        ]);
        return response()->json(['message' => 'Task updated successfully']);
    }

    public function updateMany(Request $request)
    {
        try {
            foreach ($request->tasks as $task) {
                Task::where('id', $task['id'])->where('user_id', auth()->user()->id)->update(['priority' => $task['priority']]);
            }

            return response()->json(['message' => 'Tasks updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Something went wrong'], 500);
        }
    }

    public function destroy($id)
    {
        $delete = Task::where('id', $id)->where('status', 'todo')->where('user_id', auth()->user()->id)->delete();

        if (!$delete) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        return response()->json(['message' => 'Task deleted successfully']);
    }
}
