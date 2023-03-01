from google_drive_downloader import GoogleDriveDownloader as gdd
drive_link = "https://drive.google.com/file/d/11lsh1IwfLSPmLpu5PuEyKNnkIvIU3UEc/view?usp=share_link"
file_id=drive_link.split('/')[-2]
gdd.download_file_from_google_drive(file_id=file_id, dest_path='./image.jpg', overwrite=True)


#https://drive.google.com/file/d/11lsh1IwfLSPmLpu5PuEyKNnkIvIU3UEc/view?usp=share_link