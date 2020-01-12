/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     11.3.2015 12:43:58                           */
/*==============================================================*/


drop table if exists CSet;

drop table if exists Entity;

drop table if exists Path;

drop table if exists PathTriplet;

drop table if exists Prefix;

drop table if exists SetPredicate;

drop table if exists SetTriplet;

drop table if exists Summary;

/*==============================================================*/
/* Table: CSet                                                  */
/*==============================================================*/
create table CSet
(
   SetID                bigint not null,
   SumID                bigint,
   Frequency            int,
   primary key (SetID)
);

/*==============================================================*/
/* Table: Entity                                                */
/*==============================================================*/
create table Entity
(
   EntityName           longtext not null,
   EntityID             bigint not null,
   PrefixID             int not null,
   primary key (EntityID)
);

/*==============================================================*/
/* Table: Path                                                  */
/*==============================================================*/
create table Path
(
   PathID               bigint not null,
   SumID                bigint,
   Frequency            int,
   PathHash             varchar(1024),
   primary key (PathID)
);

/*==============================================================*/
/* Table: PathTriplet                                           */
/*==============================================================*/
create table PathTriplet
(
   PathID               bigint not null,
   OrderNum             int not null,
   Subject_EntityID     bigint,
   Object_EntityID      bigint,
   Predicate_EntityID   bigint,
   primary key (PathID, OrderNum)
);

/*==============================================================*/
/* Table: Prefix                                                */
/*==============================================================*/
create table Prefix
(
   PrefixID             int not null,
   URI                  longtext,
   primary key (PrefixID)
);

/*==============================================================*/
/* Table: SetPredicate                                          */
/*==============================================================*/
create table SetPredicate
(
   SetID                bigint not null,
   EntityID             bigint not null,
   primary key (SetID, EntityID)
);

/*==============================================================*/
/* Table: SetTriplet                                            */
/*==============================================================*/
create table SetTriplet
(
   SetID                bigint not null,
   Object_EntityID      bigint not null,
   Subject_EntityID     bigint not null,
   Predicate_EntityID   bigint not null,
   Frequency            int,
   primary key (SetID, Object_EntityID, Subject_EntityID, Predicate_EntityID)
);

/*==============================================================*/
/* Table: Summary                                               */
/*==============================================================*/
create table Summary
(
   SumID                bigint not null,
   Dataset              varchar(1024),
   Endpoint             varchar(1024),
   StartedAt            timestamp,
   primary key (SumID)
);

alter table CSet add constraint FK_SetFromSummary foreign key (SumID)
      references Summary (SumID) on delete restrict on update restrict;

alter table Entity add constraint FK_EntityPrefix foreign key (PrefixID)
      references Prefix (PrefixID) on delete restrict on update restrict;

alter table Path add constraint FK_FromSummary foreign key (SumID)
      references Summary (SumID) on delete restrict on update restrict;

alter table PathTriplet add constraint FK_InPath foreign key (PathID)
      references Path (PathID) on delete restrict on update restrict;

alter table PathTriplet add constraint FK_Object foreign key (Object_EntityID)
      references Entity (EntityID) on delete restrict on update restrict;

alter table PathTriplet add constraint FK_Predicate foreign key (Predicate_EntityID)
      references Entity (EntityID) on delete restrict on update restrict;

alter table PathTriplet add constraint FK_Subject foreign key (Subject_EntityID)
      references Entity (EntityID) on delete restrict on update restrict;

alter table SetPredicate add constraint FK_SetPredicate foreign key (SetID)
      references CSet (SetID) on delete restrict on update restrict;

alter table SetPredicate add constraint FK_SetPredicate2 foreign key (EntityID)
      references Entity (EntityID) on delete restrict on update restrict;

alter table SetTriplet add constraint FK_FromSet foreign key (SetID)
      references CSet (SetID) on delete restrict on update restrict;

alter table SetTriplet add constraint FK_STObject foreign key (Object_EntityID)
      references Entity (EntityID) on delete restrict on update restrict;

alter table SetTriplet add constraint FK_STPredicate foreign key (Predicate_EntityID)
      references Entity (EntityID) on delete restrict on update restrict;

alter table SetTriplet add constraint FK_STSubject foreign key (Subject_EntityID)
      references Entity (EntityID) on delete restrict on update restrict;

