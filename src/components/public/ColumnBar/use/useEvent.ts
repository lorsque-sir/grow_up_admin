import { Ref } from "vue";

interface propsArg {
  catchCheckedKeys: Fn;
  allChild: any[];
  treeRef: any;
  state: any;
  getAllChild: Fn;
  emit: Fn;
  visible: Ref<boolean>;
  nodeKey: string;
}

export const useEvent = ({
  catchCheckedKeys,
  allChild,
  treeRef,
  state,
  getAllChild,
  emit,
  visible,
  nodeKey,
}: propsArg) => {
  const onTreeChange = () => {
    catchCheckedKeys();
  };

  const onAllSelectChange = (value: boolean) => {
    if (value) {
      const keys = allChild.map((el) => el[nodeKey]);
      treeRef.value.setCheckedKeys(keys);
      state.catchTreeCheckedKeys = keys;
    } else {
      const keys = allChild
        .filter((el) => el.disabled)
        .map((el) => el[nodeKey]);
      treeRef.value.setCheckedKeys(keys);
      state.catchTreeCheckedKeys = keys;
    }
  };

  const onSetColumns = () => {
    const { treeData } = state;
    const indeterminates = treeRef.value.getHalfCheckedKeys();
    const keys = treeRef.value.getCheckedKeys(false);
    const allChild = getAllChild(treeData);
    setVisabled([...indeterminates, ...keys], allChild);
  };

  const setVisabled = (keys: string[], allChild: any[]) => {
    const columns = allChild.filter((el) => el[nodeKey]);
    for (const column of columns) {
      const isIn = keys.includes(column[nodeKey]);
      Reflect.set(column, "visible", isIn);
    }
    emit("confirm", [...state.treeData]);
    visible.value = false;
  };

  const onResetColumns = () => {
    const { treeData, catchVisible } = state;
    const allChild = getAllChild(treeData);
    const keys = Object.entries(catchVisible)
      .filter((el) => el[1])
      .map((el) => el[0]);
    setVisabled(keys, allChild);
    treeRef.value.setCheckedKeys(keys);
    visible.value = false;
  };

  return {
    onTreeChange,
    onAllSelectChange,
    onSetColumns,
    onResetColumns,
  };
};
