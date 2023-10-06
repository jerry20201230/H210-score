import * as React from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

export default function SelectSubject({ onChangeFunc, params, defaultValue, label, helperText, placeholder }) {
  const [val, setVal] = React.useState({});
  const [receivers, setReceivers] = React.useState([]);
  const subject = [
    { title: "國文", type: 0 },
    { title: "數學", type: 0 },
    { title: "英文", type: 0 },
    { title: "物理", type: 0 },
    { title: "化學", type: 0 },
    { title: "地理", type: 0 },
    { title: "公民", type: 0 },
    { title: "小考", type: 1 },
    { title: "週考", type: 1 },
  ];

  const handleClick = () => {
    setVal(subject[0]); //you pass any value from the array of subject
    // set value in TextField from dropdown list
  };
  return (
    <Stack spacing={1} sx={{ width: "100%" }}>
      <Autocomplete
        multiple
        id="tags-filled"
        options={subject.map((option) => option.title)}
        defaultValue={defaultValue}
        freeSolo

        groupBy={(option) => option.type}
        getOptionLabel={(option) => option.title}

        onChange={(e, value, situation, option) => {
          if (situation === "removeOption") {
            // console.log("--->", e, value, situation, option);
          }
          setReceivers((state) => value);
          if (params) {
            onChangeFunc(params, value)
          } else {
            onChangeFunc(value)
          }
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
            sx={{ width: "100%" }}
            {...params}
            variant="standard"
            label={label ? label : "新增標籤"}
            placeholder={placeholder ? placeholder : "新增標籤(按enter插入)"}
            helperText={helperText ? helperText : "從選單選擇，或輸入標籤名稱後按enter插入"}
          />
        )}
      />
    </Stack>
  );
}
