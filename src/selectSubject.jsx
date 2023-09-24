import * as React from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

export default function SelectSubject({onChangeFunc,params}) {
  const [val, setVal] = React.useState({});
  const [receivers, setReceivers] = React.useState([]);
  console.log(receivers);
  const handleClick = () => {
    setVal(subject[0]); //you pass any value from the array of subject
    // set value in TextField from dropdown list
  };
  return (
    <Stack spacing={1} sx={{ width: 500 }}>
      <Autocomplete
        multiple
        id="tags-filled"
        options={subject.map((option) => option.title)}
        defaultValue={[subject[0].title]}
        freeSolo
        onChange={(e, value, situation, option) => {
          if (situation === "removeOption") {
            console.log("--->", e, value, situation, option);
          }
          setReceivers((state) => value);
          onChangeFunc.func(params,value)
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="freeSolo"
            placeholder="新增標籤"
            helperText="輸入標籤名稱後按enter插入"
          />
        )}
      />
    </Stack>
  );
}

const subject = [
  { title: "國文" },
  { title: "數學" },
  { title: "英文" },
  { title: "物理" },
  { title: "化學" },
  { title: "地理" },
  { title: "公民" },
  { title: "小考" },
  { title: "週考" },
  { title: "段考" },

];
