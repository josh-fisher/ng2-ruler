feat(range): range should work for any range (negative or positive) not just 0 to n for time based and custom units.
feat(rulermode): add Dynamic ruler mode that accepts a range but grows (allows further panning) after range is met.
feat(service): create function that can be called by user to initialize an instance of the ruler on top of an element and is absolutely position determined by user position param.
feat(hatchUnits): hatch units (sub units) should be able to show their unit title, if enabled, only if they do not overlap with their parent unit title.
feat(range): have ability to have the starting "zeroed" position be different than the "start" range input.
feat(phelper): when phelper line/text goes over a unit title that unit title should be hidden until the phelper moves past that unit title.
feat(renderers): implement css and canvas renderers and add ability to switch between the current svg renderer and the two new ones.

fix(transforms): css svg transforms do not work in IE/Edge/Safari browsers. Consider using the svg transform attribute instead of the css style.transform attribute.

doc(readme): update readme to include project specific information.
doc(wiki): create tool documentation.

Add testing for everything.
