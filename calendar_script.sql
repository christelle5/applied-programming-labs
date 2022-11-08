-- MySQL Script generated by MySQL Workbench
-- Tue Oct 25 22:11:31 2022
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema calendar
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema calendar
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `calendar` DEFAULT CHARACTER SET utf8 ;
USE `calendar` ;

-- -----------------------------------------------------
-- Table `calendar`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `calendar`.`user` (
  `userId` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(25) NOT NULL,
  `firstName` VARCHAR(30) NOT NULL,
  `lastName` VARCHAR(30) NOT NULL,
  `email` VARCHAR(75) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `phone` VARCHAR(45) NULL,
  PRIMARY KEY (`userId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `calendar`.`event`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `calendar`.`event` (
  `eventId` INT NOT NULL AUTO_INCREMENT,
  `creator_userId` INT NOT NULL,
  `title` VARCHAR(60) NOT NULL,
  `aboutEvent` VARCHAR(255) NULL,
  `startDate` DATE NOT NULL,
  `endDate` DATE NOT NULL,
  `startTime` VARCHAR(5) NULL,
  `endTime` VARCHAR(5) NULL,
  PRIMARY KEY (`eventId`),
  INDEX `fk_event_user1_idx` (`creator_userId` ASC) VISIBLE,
  CONSTRAINT `fk_event_user1`
    FOREIGN KEY (`creator_userId`)
    REFERENCES `calendar`.`user` (`userId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `calendar`.`participant`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `calendar`.`participant` (
  `user_userId` INT NOT NULL,
  `event_eventId` INT NOT NULL,
  `user_status` VARCHAR(30) NOT NULL,
  INDEX `fk_user_has_event_event1_idx` (`event_eventId` ASC) VISIBLE,
  INDEX `fk_user_has_event_user_idx` (`user_userId` ASC) VISIBLE,
  CONSTRAINT `fk_user_has_event_user`
    FOREIGN KEY (`user_userId`)
    REFERENCES `calendar`.`user` (`userId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_user_has_event_event1`
    FOREIGN KEY (`event_eventId`)
    REFERENCES `calendar`.`event` (`eventId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;