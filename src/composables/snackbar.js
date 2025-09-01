const snackbarData = reactive({
  color: "success",
  text: "",
  visible: false,
});

const showSnackbar = ({ color, text }) => {
  snackbarData.color = color;
  snackbarData.text = text;
  snackbarData.visible = true;
};

export { showSnackbar, snackbarData };
