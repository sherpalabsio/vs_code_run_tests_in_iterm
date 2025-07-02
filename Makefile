.PHONY: help
help:
	@echo 'install_locally   - Install the extension locally'
	@echo 'uninstall_locally - Uninstall the installed extension'
	@echo 'publish_login     - Login to the publisher account'
	@echo 'publish           - Publish the extension to the marketplace'
	@echo 'prepublish        - Publish the extension to the marketplace as a pre-release'

.PHONY: install_locally
install_locally:
	yarn run package --out dist/local.vsix
	code --install-extension dist/local.vsix

.PHONY: uninstall_locally
uninstall_locally:
	code --uninstall-extension undefined_publisher.run-tests-in-iterm

.PHONY: publish_login
publish_login:
	echo $AZURE_PERSONAL_ACCESS_TOKEN
	yarn vsce login sherpalabsio

.PHONY: publish
publish:
	yarn vsce publish

.PHONY: prepublish
publish:
	yarn vsce publish --pre-release
