import { useEffect, useState } from "react";
import {
  TextField,
  Box,
  IconButton,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import ReactCountryFlag from "react-country-flag";
import { SelectChangeEvent } from '@mui/material';

interface FilterFormProps {
  onFilter: (filterValue: string) => void;
  onSearch: (searchValue: string) => void;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

//Exhaustive list of languages available on the News API
const languageOptions = [
  { code: 'DE', lang: 'de' }, // German
  { code: 'NL', lang: 'nl' }, // Dutch
  { code: 'FR', lang: 'fr' }, // French
  { code: 'GB', lang: 'en' }, // English
  { code: 'ES', lang: 'es' }, // Spanish
  { code: 'IT', lang: 'it' }, // Italian
  { code: 'NO', lang: 'no' }, // Norwegian
  { code: 'PL', lang: 'pl' }, // Polish
  { code: 'BR', lang: 'pt' }, // Portuguese
  { code: 'RU', lang: 'ru' }, // Russian
  { code: 'SE', lang: 'sv' }, // Swedish
  { code: 'TR', lang: 'tr' }, // Turkish
  { code: 'UA', lang: 'uk' }, // Ukrainian
  { code: 'CN', lang: 'zh' }, // Chinese
];

// This form is used to filter the news articles by keyword OR search for a specific keyword
// Press ENTER to search, and simply type to filter the existing articles

// Also contains a language selector

const FilterForm: React.FC<FilterFormProps> = ({ onFilter, onSearch, selectedLanguage, onLanguageChange }) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue("");
  }, [selectedLanguage]);

  //When text is typed in the input field, update the local state
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onFilter(event.target.value); // Continue filtering as user types
  };

  //Manage manual Search (not scrolling)
  const handleSearchSubmit = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    onSearch(inputValue); // Trigger search on Enter key or button click
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    onLanguageChange(newLanguage); // Update the language state in the parent component
  };

  return (
    <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <Select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          displayEmpty
          sx={{ height: '40px' }}
        >
          {languageOptions.map((option) => (
            <MenuItem key={option.lang} value={option.lang}>
              <ReactCountryFlag countryCode={option.code} svg /> {option.lang.toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Search or Filter"
        variant="outlined"
        size="small"
        value={inputValue}
        onChange={handleInputChange}
        sx={{ flexGrow: 1 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit" aria-label="submit">
                <KeyboardReturnIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default FilterForm;
