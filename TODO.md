feat(unit): ability to set stroke width per unit.
feat(unit): ability to set stroke/fill color per unit.
feat(unit): ability to set custom font size per unit.
feat(range): range should work for any range (negative or positive) not just 0 to n for time based and custom units.
feat(rulermode): add Dynamic ruler mode that accepts a range but grows (allows further panning) after range is met.
doc(readme): update readme to include project specific information.
doc(wiki): create tool documentation.
feat(input): initialize app component inputs.
fix(units): remove rulerservice as an parameter for units and make rulerservice run and init funciton on all units during init of app component.
feat(service): create function that can be called by user to initialize an instance of the ruler on top of an element and is absolutely position determined by user position param.
feat(hatchUnits): hatch units (sub units) should be able to show their unit title, if enabled, only if they do not overlap with their parent unit title.

Add testing for everything.
