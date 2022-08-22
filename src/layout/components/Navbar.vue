<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="device!=='mobile'" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />
      </template>
      <el-tooltip :content="$t('navbar.toPDF')">
        <div class="right-menu-item hover-effect"  @click="iframeToPDF()">
          <svg style="vertical-align:middle" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="currentColor">
            <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
          </svg>
        </div>
      </el-tooltip>
      <el-tooltip :content="$t('navbar.toDOCX')">
        <div class="right-menu-item hover-effect"  @click="iframeToDOC()">
          <svg style="vertical-align:middle" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="currentColor">
            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
          </svg>
        </div>
      </el-tooltip>
      <error-log class="errLog-container right-menu-item hover-effect" />

      <screenfull id="screenfull" class="right-menu-item hover-effect" />

      <el-tooltip :content="$t('Global Size')" effect="dark" placement="bottom">
        <size-select id="size-select" class="right-menu-item hover-effect" />
      </el-tooltip>
      <lang-select class="right-menu-item hover-effect" />

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="user.avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <svg-icon class-name="user-icon user-avatar" icon-class="user" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile">
            <el-dropdown-item>
              {{ $t('navbar.profile') }}
            </el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import LangSelect from '@/components/LangSelect'
import AuthenticationUtils from 'common/AuthenticationUtils'
import rf from 'requestfactory'
import {jsPDF} from 'jspdf';
import html2canvas from '@/utils/html2canvas.js';

 
// import fs from 'fs';
// import HTMLtoDOCX from 'html-to-docx';
// import { Document, Paragraph, Packer } from 'docx';
// import { saveAs } from 'file-saver';

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    LangSelect,
    Screenfull,
    SizeSelect,
    Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'user',
      'device',
      'printing'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await rf.getRequest('AuthRequest').logout()
      await AuthenticationUtils.logout();
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    iframeToPDF() {
      let fileName = this.$route.path;
      console.log(fileName);
      let iframe = window.document.getElementById(this.$route.path); //'content-body'      
      if (!iframe) {
        this.$alert("No iframe was found in current view!");  
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: 'Generating PDF Report...',
        spinner: 'el-icon-loading',
        background: 'rgba(50, 50, 50, 0.7)'
      });
      // if (!iframe.contentWindow.html2canvas) {
      //   let scriptElem = iframe.contentDocument.createElement('script');
      //   scriptElem.src = '/wui/js/html2canvas.min.js';
      //   iframe.contentDocument.body.appendChild(scriptElem);
      //   console.log('added html2canvas');        
      // }
      console.log('prepare generating img...');
      setTimeout(() => {
        let w = iframe.contentDocument.body.clientWidth;
        let h = iframe.contentDocument.body.clientHeight;
        console.log('canvas1:',w, h);
        // console.log(iframe.contentWindow);
        html2canvas(iframe.contentDocument.body, {useCORS: true, width: 1.25*w, height: 1.20*h }).then(canvas => {
          // let image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
          let width = canvas.width;
          let height = canvas.height;
          console.log('canvas2:', width, height);
          let doc = new jsPDF({
            // format: 'A4',
            unit: 'mm',
            format: [6 + (+width) / 3.7, 6 + (+height) / 3.7]
          });
          doc.addImage(canvas, 'PNG', 3, 3);
          fileName = fileName.substring(1);
          fileName = fileName.replace('/', '_');
          doc.save(fileName + ".pdf");
        }).finally(() => {
          loading.close();
        });
      }, 100);
    },
    iframeToDOC() {
      let fileName = this.$route.path;
      fileName = fileName.substring(1);
      fileName = fileName.replace('/', '_')
      let iframe = window.document.getElementById(this.$route.path); //'content-body'
      // console.log(iframe);
      if (!iframe) {
        this.$alert("No iframe was found in current view!");  
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: 'Generating Doc Report...',
        spinner: 'el-icon-loading',
        background: 'rgba(50, 50, 50, 0.7)'
      });
      // if (!iframe.contentWindow.html2canvas) {
      //   let scriptElem = iframe.contentDocument.createElement('script');
      //   scriptElem.src = '/wui/js/html2canvas.min.js';
      //   iframe.contentDocument.body.appendChild(scriptElem);
      // }
      setTimeout(() => {
        let w = iframe.contentDocument.body.clientWidth;
        let h = iframe.contentDocument.body.clientHeight;
        console.log('canvas1:',w, h);
        // console.log(iframe.contentWindow);
        html2canvas(iframe.contentDocument.body, { width: w, height: h }).then(canvas => {
          // let width = canvas.width;
          //let height = canvas.height;
          let canvas1 = iframe.contentDocument.createElement('canvas');
          let context1 = canvas1.getContext('2d');
          canvas1.width = 0.9*w;
          canvas1.height = 0.9*h;
          context1.drawImage(canvas, 0,0, canvas1.width, canvas1.height);
          let image = canvas1.toDataURL("image/png", 1.0);
          let htmlTag = `<html xmlns:o='urn:schemas-microsoft-com:office:office' 
                xmlns:w='urn:schemas-microsoft-com:office:word' 
                xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"></head>`;
          let contentHTML = encodeURIComponent(`${htmlTag}<body style='width: 100%;'>
            <center>
            <h2>Báo cáo kết quả tổng hợp dữ liệu cảnh báo xâm nhập </h2>
            <h4> ${fileName} </h4>
            </center> <br>            
            <img style='width: 100%;' src='${image}' />
          </body></html>`);
          //<img style='width: ${w/2}px;height: ${h/2}px;' src='${image}' />          
          let source = `data:application/msword;charset=utf-8,${contentHTML}`;
          console.log(source);          
          const link = document.createElement('a');
          link.href = source;          
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();

          // // Create a new Document an save it in a variable
          // let doc = new Document();
          // // Add title
          // doc.addParagraph(new Paragraph('Báo cáo kết quả tổng hợp dữ liệu cảnh báo xâm nhập').title().center());
          // // Add subtitle
          // doc.addParagraph(new Paragraph(fileName).heading4().thematicBreak().center());
          // // Add image
          // doc.createImage(image, {});

          // fileName = fileName.replace('/', '_') + '.docx';
          // fileName = fileName.substring(1);
          
          // // To export into a .docx file
          // let packer = new Packer();
          // packer.toBlob(doc).then(blob => {
          //   saveAs(blob, fileName);
          // });

          // (async () => {            
          //   const fileBuffer = await HTMLtoDOCX(contentHTML);
          //   fs.writeFile(fileName, fileBuffer, (error) => {
          //     if (error) {
          //       console.log('Docx file creation failed');
          //       return;
          //     }
          //     console.log('Docx file created successfully');
          //   });
          // })();
        }).finally(() => {
          loading.close();
        });
      }, 100);
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 2px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 20px;
          height: 20px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
