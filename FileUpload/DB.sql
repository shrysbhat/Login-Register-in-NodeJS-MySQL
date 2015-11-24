create database DataSecService;

CREATE TABLE DataSecService.user_records (
  user_id int(10) unsigned NOT NULL AUTO_INCREMENT,
  email varchar(45) NOT NULL PRIMARY KEY,
  fname varchar(50) NOT NULL,
  lname varchar(50) NOT NULL,
  password varchar(32) NOT NULL,
  groupid int(2), 
  user_type varchar(1) DEFAULT 'U' NOT NULL,
  
  UNIQUE (user_id)
  
  
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

ALTER TABLE DataSecService.user_records
ADD FOREIGN KEY (groupid)
  REFERENCES policy_engine_version_control(pevc_group_id);

CREATE TABLE DataSecService.access_control (
	email_id varchar(45) NOT NULL,
	group_id int(2),
	image_upload int(1),
	image_download int(1),
	audio_upload int(1),
	audio_download int(1),
	video_upload int(1),
	video_download int(1)
	

) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE DataSecService.access_control
  	ADD FOREIGN KEY (email_id)
    REFERENCES DataSecService.user_records(email),
	
	ADD FOREIGN KEY (group_id)
	REFERENCES DataSecService.user_records(groupid);

CREATE TABLE DataSecService.policy_engine_version_control (
	pevc_group_id int(2) NOT NULL DEFAULT 00 PRIMARY KEY,
	policy_id varchar(100)
	

) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE DataSecService.policy_engine_version_control
	ADD FOREIGN KEY (pevc_group_id)
	REFERENCES user_records(groupid);

CREATE TABLE DataSecService.keyphrase (
	email_id varchar(45) NOT NULL,
	keyphrase varchar(5)
	

) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE DataSecService.keyphrase
ADD FOREIGN KEY (email_id)
	REFERENCES user_records(email);

CREATE TABLE DataSecService.folder_mapping (
	emailid VARCHAR(45),	
    folderid varchar(10)

) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE datasecservice.folder_mapping
ADD COLUMN folderid varchar(10);

ALTER TABLE DataSecService.folder_mapping
	ADD FOREIGN KEY (emailid)
    REFERENCES DataSecService.user_records(email);
    
use DataSecService;
    

select * from user_records;
Select * from keyphrase;
select * from access_control;
select * from folder_mapping;

ALTER TABLE DataSecService.access_control
DROP COLUMN image_download, 
DROP COLUMN audio_download, 
DROP COLUMN video_download;