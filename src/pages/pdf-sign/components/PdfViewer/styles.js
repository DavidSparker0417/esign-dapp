import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  docWrapper: {
    canvas: {
      width: "100%!important",
      height: "auto!important"
    },
    ".react-pdf__Page__textContent" : {
      width: "100%!important",
      overflow: "hidden!important"
    }
  },
  filename: {
    paddingLeft: "16px",
    overflow: "hidden"
  },
  containerCenter: {
    justifyContent: "center",
    alignItems: "center"
  },
  pagenum: {
    paddingRight: "16px",
    justifyContent: "end"
  },
  text: {
    fontSize: "14px",
    [theme.breakpoints.down('xs')]: {
      fontSize: "10px"
    }
  },
}));