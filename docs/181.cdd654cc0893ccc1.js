"use strict";(self.webpackChunkng_football=self.webpackChunkng_football||[]).push([[181],{466:(J,y,r)=>{r.r(y),r.d(y,{FootballResultsModule:()=>Y});var u=r(814),g=r(472),t=r(946),p=r(645),h=r(773),b=r(619),f=r(96),m=r(398),d=r(862);class Z{constructor(s,e,i,a){this.country=s,this.name=e,this.apiId=i,this.currentSeason=a}}let v=(()=>{class n{get(e){const i=localStorage.getItem(e);if(i){const a=JSON.parse(i);if(a&&a.expiration>Date.now())return a.data}return null}set(e,i,a){const l=Date.now()+a;localStorage.setItem(e,JSON.stringify({data:i,expiration:l}))}static#t=this.\u0275fac=function(i){return new(i||n)};static#e=this.\u0275prov=t.Yz7({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})(),w=(()=>{class n{constructor(e,i){this.http=e,this.cacheService=i,this.apiKey="19332c6ea72f76eb2cd3608a1f623959",this.apiUrl="https://v3.football.api-sports.io/",this.cacheKey="league",this.leagueId=[39,140,61,78,135],this._currentLeague=new b.X(null),this.currentLeague$=this._currentLeague.asObservable()}getLeagues(){const e=this.cacheService.get(this.cacheKey);if(e)return(0,f.of)(e);{const i=new d.WM({"x-apisports-key":this.apiKey});return this.http.get(`${this.apiUrl}/leagues?current=true`,{headers:i}).pipe((0,m.U)(a=>{if(0===a.errors.length){let l=a.response.filter(o=>this.leagueId.includes(o.league.id)).map(o=>new Z(o.country.name,o.league.name,o.league.id,o.seasons.filter(c=>!0===c.current)[0].year));return this.cacheService.set(this.cacheKey,l,864e5),l}return[]}))}}selectCurrentLeague(e){this._currentLeague.next(e)}get currentLeague(){return this._currentLeague.getValue()}static#t=this.\u0275fac=function(i){return new(i||n)(t.LFG(d.eN),t.LFG(v))};static#e=this.\u0275prov=t.Yz7({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})();function _(n,s){if(1&n){const e=t.EpF();t.TgZ(0,"li",4),t.NdJ("click",function(){const l=t.CHM(e).$implicit,o=t.oxw();return t.KtG(o.leagueSelect(l))}),t._uU(1),t.qZA()}if(2&n){const e=s.$implicit,i=t.oxw();t.ekj("active",i.isActive(e)),t.xp6(1),t.hij(" ",e.country," ")}}let S=(()=>{class n{constructor(e){this.leagueService=e,this.destroyed$=new p.x,this.leagues=[]}leagueSelect(e){this.leagueService.selectCurrentLeague(e)}isActive(e){return this.leagueService.currentLeague?.apiId===e?.apiId}ngOnInit(){this.leagueService.getLeagues().pipe((0,h.R)(this.destroyed$)).subscribe(e=>{this.leagues=e})}ngOnDestroy(){this.destroyed$.next(!0),this.destroyed$.complete()}static#t=this.\u0275fac=function(i){return new(i||n)(t.Y36(w))};static#e=this.\u0275cmp=t.Xpm({type:n,selectors:[["app-league-list"]],decls:4,vars:1,consts:[[1,"container"],[1,"navbar","navbar-expand-lg","navbar-light","bg-light","rounded-3"],[1,"mx-auto","text-center"],["class","nav-item custom-nav-item",3,"active","click",4,"ngFor","ngForOf"],[1,"nav-item","custom-nav-item",3,"click"]],template:function(i,a){1&i&&(t.TgZ(0,"div",0)(1,"nav",1)(2,"ul",2),t.YNc(3,_,2,3,"li",3),t.qZA()()()),2&i&&(t.xp6(3),t.Q6J("ngForOf",a.leagues))},dependencies:[u.sg],styles:[".custom-nav-item[_ngcontent-%COMP%]{max-width:100px;width:100px;cursor:pointer;min-height:35px}.nav-item.active[_ngcontent-%COMP%]{background-color:#ffda6a;border-radius:15px}ul[_ngcontent-%COMP%]{list-style:none;display:flex;margin:0;padding:0}li[_ngcontent-%COMP%]{text-align:center;line-height:40px}"]})}return n})();class x{constructor(s){this.id=s.id,this.name=s.name,this.logo=s.logo}}class C{constructor(s){this.rank=s.rank,this.points=s.points,this.goalsDiff=s.goalsDiff,this.team=new x(s.team),this.all=new O(s.all)}}class O{constructor(s){this.played=s.played,this.win=s.win,this.draw=s.draw,this.lose=s.lose}}let T=(()=>{class n{constructor(e,i){this.http=e,this.cacheService=i,this.apiKey="19332c6ea72f76eb2cd3608a1f623959",this.apiUrl="https://v3.football.api-sports.io/",this.cacheKey="standings",this._currentStanding=new b.X(null),this.currentStanding$=this._currentStanding.asObservable()}getStandings(e){const i=this.cacheService.get(this.cacheKey+e?.apiId);if(i)return(0,f.of)(i);{const a=new d.WM({"x-apisports-key":this.apiKey});return this.http.get(`${this.apiUrl}/standings?league=${e.apiId}&season=${e.currentSeason}`,{headers:a}).pipe((0,m.U)(l=>{if(0===l.errors.length){let o=l.response[0].league.standings[0].sort((c,N)=>N.rank+c.rank).map(c=>new C(c));return this.cacheService.set(this.cacheKey+e.apiId,o,36e5),o}return[]}))}}setCurrentStanding(e){this._currentStanding.next(e)}static#t=this.\u0275fac=function(i){return new(i||n)(t.LFG(d.eN),t.LFG(v))};static#e=this.\u0275prov=t.Yz7({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})(),L=(()=>{class n{constructor(e){this.el=e}onMouseEnter(){this.el.nativeElement.style.color="#0056b3",this.el.nativeElement.style.textDecoration="underline"}onMouseLeave(){this.el.nativeElement.style.color="",this.el.nativeElement.style.textDecoration=""}static#t=this.\u0275fac=function(i){return new(i||n)(t.Y36(t.SBq))};static#e=this.\u0275dir=t.lG2({type:n,selectors:[["","appLink",""]],hostBindings:function(i,a){1&i&&t.NdJ("mouseenter",function(){return a.onMouseEnter()})("mouseleave",function(){return a.onMouseLeave()})}})}return n})();function F(n,s){if(1&n&&(t.TgZ(0,"div",11)(1,"div",6),t._uU(2),t.qZA(),t.TgZ(3,"div",6),t._UZ(4,"img",12),t.qZA(),t.TgZ(5,"div",13)(6,"a",14),t._uU(7),t.qZA()(),t.TgZ(8,"div",8),t._uU(9),t.qZA(),t.TgZ(10,"div",6),t._uU(11),t.qZA(),t.TgZ(12,"div",6),t._uU(13),t.qZA(),t.TgZ(14,"div",6),t._uU(15),t.qZA(),t.TgZ(16,"div",9),t._uU(17),t.qZA(),t.TgZ(18,"div",8),t._uU(19),t.qZA()()),2&n){const e=s.$implicit;t.xp6(2),t.Oqu(e.rank),t.xp6(2),t.uIk("src",null==e||null==e.team?null:e.team.logo,t.LSH),t.xp6(2),t.Q6J("routerLink","/fixtures/"+(null==e||null==e.team?null:e.team.id)),t.xp6(1),t.Oqu(null==e||null==e.team?null:e.team.name),t.xp6(2),t.Oqu(null==e||null==e.all?null:e.all.played),t.xp6(2),t.Oqu(null==e||null==e.all?null:e.all.win),t.xp6(2),t.Oqu(null==e||null==e.all?null:e.all.lose),t.xp6(2),t.Oqu(null==e||null==e.all?null:e.all.draw),t.xp6(2),t.Oqu(null==e?null:e.goalsDiff),t.xp6(2),t.Oqu(null==e?null:e.points)}}function U(n,s){if(1&n&&(t.TgZ(0,"div")(1,"div",3)(2,"div",4)(3,"div",5)(4,"div",6),t._uU(5,"#"),t.qZA(),t.TgZ(6,"div",6),t._uU(7,"\xa0"),t.qZA(),t.TgZ(8,"div",7),t._uU(9,"Name"),t.qZA(),t.TgZ(10,"div",8),t._uU(11,"Games"),t.qZA(),t.TgZ(12,"div",6),t._uU(13,"W"),t.qZA(),t.TgZ(14,"div",6),t._uU(15,"L"),t.qZA(),t.TgZ(16,"div",6),t._uU(17,"D"),t.qZA(),t.TgZ(18,"div",9),t._uU(19,"Goal Difference"),t.qZA(),t.TgZ(20,"div",8),t._uU(21,"Points"),t.qZA()(),t.YNc(22,F,20,10,"div",10),t.qZA()()()),2&n){const e=s.ngIf;t.xp6(22),t.Q6J("ngForOf",e)}}function A(n,s){}let M=(()=>{class n{constructor(e,i){this.leagueService=e,this.standingService=i,this.destroyed$=new p.x}get currentStanding(){return this.standingService.currentStanding$}ngOnInit(){this.leagueService.currentLeague$.pipe((0,h.R)(this.destroyed$)).subscribe(e=>{e&&this.standingService.getStandings(e).pipe((0,h.R)(this.destroyed$)).subscribe(i=>{this.standingService.setCurrentStanding(i)})})}ngOnDestroy(){this.destroyed$.next(!0),this.destroyed$.complete()}static#t=this.\u0275fac=function(i){return new(i||n)(t.Y36(w),t.Y36(T))};static#e=this.\u0275cmp=t.Xpm({type:n,selectors:[["app-standing"]],decls:5,vars:4,consts:[[1,"d-flex","flex-grow-1","flex-column","align-items-center"],[4,"ngIf","ngIfElse"],["empty",""],[1,"container","mt-5"],[1,"table-container"],[1,"table-header",2,"padding","0px"],[2,"width","40px"],[2,"width","250px"],[2,"width","70px"],[2,"width","150px"],["class","table-row","style","padding:0px !important;",4,"ngFor","ngForOf"],[1,"table-row",2,"padding","0px !important"],[1,"logo"],["appLink","",2,"width","250px","text-align","start","padding-left","5px"],[3,"routerLink"]],template:function(i,a){if(1&i&&(t.TgZ(0,"div",0),t.YNc(1,U,23,1,"div",1),t.ALo(2,"async"),t.qZA(),t.YNc(3,A,0,0,"ng-template",null,2,t.W1O)),2&i){const l=t.MAs(4);t.xp6(1),t.Q6J("ngIf",t.lcZ(2,2,a.currentStanding))("ngIfElse",l)}},dependencies:[u.sg,u.O5,g.rH,L,u.Ov],styles:[".logo[_ngcontent-%COMP%]{width:25px}.table-container[_ngcontent-%COMP%]{display:flex;flex-direction:column;border:1px solid #ccc;max-width:800px}.table-header[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{border-right:1px solid #babbbc;height:40px;padding:0}.table-header[_ngcontent-%COMP%], .table-row[_ngcontent-%COMP%]{display:flex;justify-content:space-between;text-align:center;align-items:center;padding:5px;border-bottom:1px solid #ccc}.table-header[_ngcontent-%COMP%]{font-weight:700;background-color:#f0f0f0}.table-row[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{flex-grow:1;text-align:center;height:35px}.table-row[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:not(:last-child){border-right:1px solid #ccc}a[_ngcontent-%COMP%]{color:#000;text-decoration:none;transition:color .3s ease}"]})}return n})(),q=(()=>{class n{static#t=this.\u0275fac=function(i){return new(i||n)};static#e=this.\u0275cmp=t.Xpm({type:n,selectors:[["app-football-results"]],decls:9,vars:0,consts:[[1,"container","vh-100","rounded-4","divStyle","d-flex","flex-column","bg-body-secondary"],[1,"row"],[1,"col-12","text-center"],[1,"rounded-3","d-flex","m-2","flex-column","bg-light"],[1,"rounded-3","d-flex","flex-grow-1","m-2","flex-column","bg-light","tableContainer"]],template:function(i,a){1&i&&(t.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"h1"),t._uU(4,"Football Updates"),t.qZA()()(),t.TgZ(5,"div",3),t._UZ(6,"app-league-list"),t.qZA(),t.TgZ(7,"div",4),t._UZ(8,"app-standing"),t.qZA()())},dependencies:[S,M],styles:[".divStyle[_ngcontent-%COMP%]{border:1px solid #d9d9d9}.tableContainer[_ngcontent-%COMP%]{overflow-y:auto!important}"]})}return n})();class k{constructor(s,e,i){this.homeTeam=new x(s),this.awayTeam=new x(e),this.goals=new I(i)}}class I{constructor(s){this.home=s.home,this.away=s.away}}let $=(()=>{class n{constructor(e,i){this.http=e,this.cacheService=i,this.apiKey="19332c6ea72f76eb2cd3608a1f623959",this.apiUrl="https://v3.football.api-sports.io/",this.cacheKey="fixture"}getFixtures(e){const i=this.cacheService.get(this.cacheKey+e);if(i)return(0,f.of)(i);{const a=new d.WM({"x-apisports-key":this.apiKey});return this.http.get(`${this.apiUrl}/fixtures?team=${e}&last=10`,{headers:a}).pipe((0,m.U)(l=>{if(0===l.errors.length){let o=l.response.map(c=>new k(c.teams.home,c.teams.away,c.goals));return this.cacheService.set(this.cacheKey+e,o,36e5),o}return[]}))}}static#t=this.\u0275fac=function(i){return new(i||n)(t.LFG(d.eN),t.LFG(v))};static#e=this.\u0275prov=t.Yz7({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})();function P(n,s){if(1&n&&(t.TgZ(0,"div",7)(1,"div",8),t._UZ(2,"img"),t._uU(3),t.qZA(),t.TgZ(4,"div",9),t._uU(5),t.qZA(),t.TgZ(6,"div",8),t._uU(7),t._UZ(8,"img"),t.qZA()()),2&n){const e=s.$implicit;t.xp6(2),t.uIk("src",null==e||null==e.homeTeam?null:e.homeTeam.logo,t.LSH),t.xp6(1),t.hij(" ",null==e||null==e.homeTeam?null:e.homeTeam.name,""),t.xp6(2),t.AsE("",null==e||null==e.goals?null:e.goals.home," - ",null==e||null==e.goals?null:e.goals.away,""),t.xp6(2),t.hij("",null==e||null==e.awayTeam?null:e.awayTeam.name," "),t.xp6(1),t.uIk("src",null==e||null==e.awayTeam?null:e.awayTeam.logo,t.LSH)}}const D=[{path:"",component:q},{path:"fixtures/:teamId",component:(()=>{class n{constructor(e,i){this.route=e,this.fixtureService=i,this.destroyed$=new p.x,this.fixtures=[]}ngOnInit(){this.teamId=this.route.snapshot.paramMap.get("teamId"),null!=this.teamId&&this.fixtureService.getFixtures(this.teamId).pipe((0,h.R)(this.destroyed$)).subscribe(e=>{this.fixtures=e})}ngOnDestroy(){this.destroyed$.next(!0),this.destroyed$.complete()}static#t=this.\u0275fac=function(i){return new(i||n)(t.Y36(g.gz),t.Y36($))};static#e=this.\u0275cmp=t.Xpm({type:n,selectors:[["app-fixtures"]],decls:10,vars:2,consts:[[1,"container","vh-100","rounded-4","divStyle","d-flex","flex-column","bg-body-secondary"],[1,"row"],[1,"col-12","text-center"],[1,"rounded-3","d-flex","flex-grow-1","m-2","flex-column","bg-light","tableContainer"],[1,"table-container"],["class","table-row",4,"ngFor","ngForOf"],["tabindex","0","id","mainPageBtn",1,"btn","btn-success","mt-2",3,"routerLink"],[1,"table-row"],[2,"width","300px"],[2,"width","100px"]],template:function(i,a){1&i&&(t.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"h1"),t._uU(4,"Football Updates"),t.qZA()()(),t.TgZ(5,"div",3)(6,"div",4),t.YNc(7,P,9,6,"div",5),t.qZA(),t.TgZ(8,"button",6),t._uU(9,"< Back"),t.qZA()()()),2&i&&(t.xp6(7),t.Q6J("ngForOf",a.fixtures),t.xp6(1),t.Q6J("routerLink",""))},dependencies:[u.sg,g.rH],styles:["img[_ngcontent-%COMP%]{width:30px}.d-flex[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center}.table-container[_ngcontent-%COMP%]{border:1px solid #ccc}.table-row[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;padding:10px;border-bottom:1px solid #ccc}.table-header[_ngcontent-%COMP%]{font-weight:700;background-color:#f0f0f0}.table-row[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{flex:1;text-align:center}"]})}return n})()},{path:"**",redirectTo:"/"}];let K=(()=>{class n{static#t=this.\u0275fac=function(i){return new(i||n)};static#e=this.\u0275mod=t.oAB({type:n});static#n=this.\u0275inj=t.cJS({imports:[g.Bz.forChild(D),g.Bz]})}return n})(),Y=(()=>{class n{static#t=this.\u0275fac=function(i){return new(i||n)};static#e=this.\u0275mod=t.oAB({type:n});static#n=this.\u0275inj=t.cJS({imports:[u.ez,K]})}return n})()}}]);