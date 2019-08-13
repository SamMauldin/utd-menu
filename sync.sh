#!/bin/bash
: <<'END_COMMENT'

  Copyright 2019 Sam Mauldin. All rights reserved.

	This file is part of utd-menu.

	utd-menu is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	utd-menu is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with utd-menu. If not, see <https://www.gnu.org/licenses/>.

END_COMMENT

gcloud config set account sam@sammauld.in
gsutil -h "Cache-Control:no-cache" -m rsync -x "\.DS_Store" -rd ./public gs://utd.mauldin.me/menu
