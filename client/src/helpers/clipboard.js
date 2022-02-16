const fulfilledDefault = (data) => {
  console.log('You copy:', data);
};
const rejectedDefault = (data) => {
  console.error("Doesn't copy data");
};

export const updateClipboard = (copyData, fulfilled, rejected) => {
  navigator.clipboard.writeText(copyData).then(
    () => {
      !fulfilled && fulfilledDefault(copyData);
    },
    () => {
      !rejected && rejectedDefault();
    },
  );
};
