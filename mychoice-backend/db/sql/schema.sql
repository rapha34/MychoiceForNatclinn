create schema mychoice_v2 collate utf8_bin;

create table criterion
(
	idCriterion int(3) auto_increment
		primary key,
	nameCriterion varchar(30) not null
)
collate=utf8_unicode_ci;

create table aim
(
	idAim int(3) auto_increment
		primary key,
	description varchar(150) not null,
	numCriterion int(3) not null,
	constraint aim_ibfk_1
		foreign key (numCriterion) references criterion (idCriterion)
			on delete cascade
)
collate=utf8_unicode_ci;

create index fk_aim_criterion
	on aim (numCriterion);

create table dataalternative
(
	idData int(3) auto_increment
		primary key,
	numAlternative int(3) not null,
	numProperty int(3) not null,
	numQualValue int(3) null,
	infValue decimal null,
	supValue decimal null,
	numSource int(3) not null
)
collate=utf8_unicode_ci;

create table likedislike
(
	idLikeDislike int(3) auto_increment,
	numProject int(10) not null,
	numArgument int(3) not null,
	numStakeholder int(3) not null,
	numNewArgument int(3) null,
	date date null,
	typeLikeDislike tinyint(1) default 1 not null,
	aboutContent tinyint(1) not null,
	aboutConfidence tinyint(1) not null,
	confidenceConcern varchar(30) null,
	primary key (idLikeDislike, numProject)
)
collate=utf8_unicode_ci;

create table project
(
	idProject int(3) auto_increment
		primary key,
	nameProject varchar(30) not null,
	description text null,
	image varchar(100) null
)
collate=utf8_unicode_ci;

create table alternative
(
	idAlternative int(3) auto_increment
		primary key,
	nameAlternative varchar(200) not null,
	description text null,
	numProject int(3) not null,
	iconAlternative varchar(256) null,
	imageAlternative varchar(256) null,
	constraint alternative_ibfk_1
		foreign key (numProject) references project (idProject)
			on delete cascade
)
collate=utf8_unicode_ci;

create index fk_alternative_project
	on alternative (numProject);

create table property
(
	idProperty int(3) auto_increment
		primary key,
	nameProperty varchar(50) not null,
	unit varchar(10) null
)
collate=utf8_unicode_ci;

create table qualvalue
(
	idQualValue int(3) auto_increment
		primary key,
	qualValue varchar(30) not null
)
collate=utf8_unicode_ci;

create table incompatiblevalues
(
	numQualValue1 int(3) not null,
	numQualValue2 int(3) not null,
	constraint incompatiblevalues_ibfk_1
		foreign key (numQualValue1) references qualvalue (idQualValue)
			on delete cascade,
	constraint incompatiblevalues_ibfk_2
		foreign key (numQualValue2) references qualvalue (idQualValue)
			on delete cascade
)
collate=utf8_unicode_ci;

create index fk_incompatiblevalues_qualvalue1
	on incompatiblevalues (numQualValue1);

create index fk_incompatiblevalues_qualvalue2
	on incompatiblevalues (numQualValue2);

create table stakeholder
(
	idStakeholder int(3) auto_increment
		primary key,
	nameStakeholder varchar(100) not null
)
collate=utf8_unicode_ci;

create table hasexpertise
(
	numStakeholder int(3) not null,
	numCriterion int(3) not null,
	numProject int(10) not null,
	primary key (numStakeholder, numCriterion, numProject),
	constraint hasexpertise_ibfk_1
		foreign key (numStakeholder) references stakeholder (idStakeholder)
			on delete cascade,
	constraint hasexpertise_ibfk_2
		foreign key (numProject) references criterion (idCriterion)
			on delete cascade,
	constraint hasexpertise_ibfk_3
		foreign key (numProject) references project (idProject)
			on delete cascade
)
collate=utf8_unicode_ci;

create index fk_hasexpertise_project
	on hasexpertise (numProject);

create table typesource
(
	idTypeSource int(3) auto_increment
		primary key,
	nameTypeSource varchar(30) not null,
	fiability tinyint(1) null
)
collate=utf8_unicode_ci;

create table source
(
	idSource int(3) auto_increment
		primary key,
	nameSource tinytext not null,
	obtention varchar(100) null,
	date year null,
	fiability tinyint(1) null,
	numTypeSource int(3) not null,
	constraint source_ibfk_1
		foreign key (numTypeSource) references typesource (idTypeSource)
			on delete cascade
)
collate=utf8_unicode_ci;

create table argument
(
	idArgument int(3) not null,
	numStakeholder int(3) not null,
	numAlternative int(3) not null,
	typeProCon char not null,
	numProperty int(3) not null,
	numQualValue int(3) not null,
	infValue float null,
	supValue float null,
	unit varchar(10) default '%' null,
	date date null,
	numSource int(3) not null,
	numAim int not null,
	assertion text null,
	explanation text null,
	isProspective tinyint(1) null,
	hasCoverage int(3) null,
	confidenceLevel tinyint(1) null,
	numProject int(10) not null,
	`condition` varchar(100) null,
	primary key (idArgument, numProject),
	constraint argument_ibfk_1
		foreign key (numStakeholder) references stakeholder (idStakeholder)
			on delete cascade,
	constraint argument_ibfk_2
		foreign key (numAlternative) references alternative (idAlternative)
			on delete cascade,
	constraint argument_ibfk_3
		foreign key (numProperty) references property (idProperty)
			on delete cascade,
	constraint argument_ibfk_4
		foreign key (numQualValue) references qualvalue (idQualValue)
			on delete cascade,
	constraint argument_ibfk_5
		foreign key (numSource) references source (idSource)
			on delete cascade,
	constraint argument_ibfk_6
		foreign key (numAim) references aim (idAim)
			on delete cascade,
	constraint argument_ibfk_7
		foreign key (numProject) references project (idProject)
			on delete cascade
)
collate=utf8_unicode_ci;

create index fk_argument_aim
	on argument (numAim);

create index fk_argument_alternative
	on argument (numAlternative);

create index fk_argument_project
	on argument (numProject);

create index fk_argument_property
	on argument (numProperty);

create index fk_argument_qualvalue
	on argument (numQualValue);

create index fk_argument_source
	on argument (numSource);

create index numStakeholder
	on argument (numStakeholder);

create index fk_source_source
	on source (numTypeSource);

