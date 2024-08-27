import zipfile

zip_path = 'best_model_64_64.zip'
zip_name = zip_path.split(".")[0]

zip_path = 'best_model_64_64.zip'


with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    # extract all the files to a specified directory
    zip_ref.extractall('./')