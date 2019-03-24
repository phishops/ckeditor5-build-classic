
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import {
	createDropdown,
	addToolbarToDropdown
} from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

class MergeFields extends Plugin {
	static get pluginName() {
		return 'mergeFields';
	}
	init() {
		const editor = this.editor;
		const t = this.editor.t;
		const componentFactory = editor.ui.componentFactory;
		const mergeOptions = editor.config.get( 'mergeFields.options' );
		mergeOptions.forEach( option => this._addButton( option ) );
		componentFactory.add( 'mergeFields', locale => {
			const dropdownView = createDropdown( locale );
			const buttons = mergeOptions.map( option => componentFactory.create( `mergeFields:${ option.displayValue }` ) );
			addToolbarToDropdown( dropdownView, buttons );
			dropdownView.buttonView.set( {
				label: t( 'Merge Fields' ),
				tooltip: true,
				withText: true
			} );
			dropdownView.toolbarView.isVertical = true;
			dropdownView.extendTemplate( {
				attributes: {
					class: 'ck-alignment-dropdown'
				}
			} );
			return dropdownView;
		} );
	}

	/**
	 * Helper method for initializing the button and linking it with an appropriate command.
	 *
	 * @private
	 * @param {String} option The name of the alignment option for which the button is added.
	 */
	_addButton( option ) {
		const editor = this.editor;
		editor.ui.componentFactory.add( `mergeFields:${ option.displayValue }`, locale => {
			const buttonView = new ButtonView( locale );
			buttonView.set( {
				label: option.displayValue,
				withText: true,
				// icon: icons.get(option),
				tooltip: true
			} );
			this.listenTo( buttonView, 'execute', () => {
				editor.model.change( writer => {
					const insertPosition = editor.model.document.selection.getLastPosition();
					writer.insertText( '[' + option.name + ']', {
						bold: true
					}, insertPosition );
				} );
				editor.editing.view.focus();
			} );
			return buttonView;
		} );
	}
}

export default MergeFields;
