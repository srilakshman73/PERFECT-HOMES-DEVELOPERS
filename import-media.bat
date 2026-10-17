@echo off
title Perfect Homes & Developers - Local Media Importer
echo =================================================================
echo  PERFECT HOMES & DEVELOPERS - LOCAL MEDIA IMPORT TOOL
echo  Imports local property photos and videos from D:\Perfect homes & developers\photos
echo =================================================================
echo.
cd /d "%~dp0"
node scripts\import-local-media.js
echo.
pause
