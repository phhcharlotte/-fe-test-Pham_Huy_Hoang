import { useCallback } from "react";
import { useAppDispatch } from "./redux";
import { startLoading, stopLoading } from "../stores/TaskSlice";
import type { LoadingKey } from "../stores/TaskSlice";

const LOADING_DELAY: Record<LoadingKey, number> = {
  filter: 500,
  addTask: 500,
  updateTask: 500,
  deleteTask: 500,
  deleteManyTasks: 500,
  updateStatus: 500,
};

export function useLoading() {
  const dispatch = useAppDispatch();

  const withLoading = useCallback(
    async <T>(key: LoadingKey, action: () => T): Promise<T> => {
      dispatch(startLoading(key));

      await new Promise((resolve) => setTimeout(resolve, LOADING_DELAY[key]));
      return action();
    },
    [dispatch],
  );

  return { withLoading };
}
